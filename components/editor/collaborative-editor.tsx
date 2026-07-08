"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { MonacoBinding } from "y-monaco";
import type { Awareness } from "y-protocols/awareness";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useTheme } from "next-themes";
import { getLanguage } from "@/lib/languages";
import { EditorSkeleton } from "./editor-skeleton";

interface Props {
  language: string;
  readOnly: boolean;
}

/** Monaco bound to the room's shared Yjs document, with live remote cursors. */
export function CollaborativeEditor({ language, readOnly }: Props) {
  const room = useRoom();
  const { resolvedTheme } = useTheme();
  const userInfo = useSelf((me) => me.info);
  const [editorRef, setEditorRef] =
    useState<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!editorRef) return;
    const model = editorRef.getModel();
    if (!model) return;

    const yProvider = getYjsProviderForRoom(room);
    const yText = yProvider.getYDoc().getText("monaco");

    // Awareness "user" powers y-monaco's remote cursor/selection styling.
    yProvider.awareness.setLocalStateField("user", {
      name: userInfo?.name ?? "Anonymous",
      color: userInfo?.color ?? "#6366f1",
    });

    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editorRef]),
      // Liveblocks' Awareness is runtime-compatible with y-protocols' type.
      yProvider.awareness as unknown as Awareness,
    );

    return () => binding.destroy();
  }, [editorRef, room, userInfo]);

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
