"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import * as Y from "yjs";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { MonacoBinding } from "y-monaco";
import type { Awareness } from "y-protocols/awareness";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { getLanguage } from "@/lib/languages";
import { saveFileAction } from "@/app/(app)/file-actions";
import { useEditorStore } from "@/store/editor-store";
import { EditorSkeleton } from "./editor-skeleton";

const AUTOSAVE_MS = 1500;

interface Props {
  fileId: string;
  language: string;
  readOnly: boolean;
}

/** Monaco bound to the file's shared Yjs text, with live cursors + auto-save. */
export function CollaborativeEditor({ fileId, language, readOnly }: Props) {
  const room = useRoom();
  const { resolvedTheme } = useTheme();
  const userInfo = useSelf((me) => me.info);
  const [editorRef, setEditorRef] =
    useState<editor.IStandaloneCodeEditor | null>(null);

  const setSaveState = useEditorStore((s) => s.setSaveState);
  const setSave = useEditorStore((s) => s.setSave);
  const setGetContent = useEditorStore((s) => s.setGetContent);
  const setApplyContent = useEditorStore((s) => s.setApplyContent);

  const lastSavedRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!editorRef) return;
    const model = editorRef.getModel();
    if (!model) return;

    const yProvider = getYjsProviderForRoom(room);
    const yText = yProvider.getYDoc().getText(`file:${fileId}`);

    yProvider.awareness.setLocalStateField("user", {
      name: userInfo?.name ?? "Anonymous",
      color: userInfo?.color ?? "#6366f1",
    });

    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editorRef]),
      yProvider.awareness as unknown as Awareness,
    );

    lastSavedRef.current = yText.toString();
    setSaveState("saved");

    const doSave = async () => {
      const content = yText.toString();
      if (content === lastSavedRef.current) {
        setSaveState("saved");
        return;
      }
      setSaveState("saving");
      const res = await saveFileAction(fileId, content);
      if (res.ok) {
        lastSavedRef.current = content;
        setSaveState("saved");
      } else {
        setSaveState("unsaved");
        toast.error(res.error);
      }
    };

    setGetContent(() => yText.toString());
    setSave(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      void doSave();
    });
    // Restore: replace the whole document in one Yjs transaction.
    setApplyContent((text: string) => {
      const doc = yProvider.getYDoc();
      doc.transact(() => {
        yText.delete(0, yText.length);
        yText.insert(0, text);
      });
    });

    const observer = (_e: Y.YTextEvent, transaction: Y.Transaction) => {
      if (yText.toString() === lastSavedRef.current) {
        setSaveState("saved");
        return;
      }
      setSaveState("unsaved");
      // Only the client that made the edit schedules the auto-save.
      if (!transaction.local || readOnly) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => void doSave(), AUTOSAVE_MS);
    };
    yText.observe(observer);

    return () => {
      yText.unobserve(observer);
      if (timerRef.current) clearTimeout(timerRef.current);
      binding.destroy();
      setSave(null);
      setGetContent(null);
      setApplyContent(null);
    };
  }, [
    editorRef,
    room,
    fileId,
    readOnly,
    userInfo,
    setSaveState,
    setSave,
    setGetContent,
    setApplyContent,
  ]);

  const monacoLanguage = getLanguage(language)?.monaco ?? language;

  return (
    <Editor
      onMount={(instance) => setEditorRef(instance)}
      language={monacoLanguage}
      theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
      loading={<EditorSkeleton />}
      options={{
        readOnly,
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        smoothScrolling: true,
        padding: { top: 12 },
        tabSize: 2,
      }}
    />
  );
}
