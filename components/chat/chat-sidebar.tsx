"use client";

import { useEffect, useRef, useState } from "react";
import { FiSend, FiX } from "react-icons/fi";
import {
  useMutation,
  useOthers,
  useSelf,
  useStorage,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense";
import { LiveList } from "@liveblocks/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/chat-store";
import { ChatMessageRow } from "./chat-message-row";
import type { ChatMessage } from "@/liveblocks.config";

export function ChatSidebar() {
  const isOpen = useChatStore((s) => s.isOpen);
  const close = useChatStore((s) => s.close);
  const incUnread = useChatStore((s) => s.incUnread);

  const messages = useStorage((root) => root.messages);
  const selfId = useSelf((me) => me.id);
  const updateMyPresence = useUpdateMyPresence();
  const typingUsers = useOthers((others) =>
    others.filter((o) => o.presence.typing).map((o) => o.info.name),
  );

  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLen = useRef(0);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const list = (messages ?? []) as readonly ChatMessage[];

  // Unread tracking (hooks run even while the panel is closed).
  useEffect(() => {
    if (list.length > prevLen.current && !isOpen) {
      incUnread(list.length - prevLen.current);
    }
    prevLen.current = list.length;
  }, [list.length, isOpen, incUnread]);

  // Auto-scroll to newest when open.
  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ block: "end" });
  }, [list.length, isOpen]);

  const sendMessage = useMutation(({ storage, self }, body: string) => {
    const info = self.info;
    const msgs = storage.get("messages") as LiveList<ChatMessage>;
    msgs.push({
      id: crypto.randomUUID(),
      userId: self.id,
      name: info.name,
      color: info.color,
      body,
      at: Date.now(),
    });
  }, []);

  function onDraftChange(value: string) {
    setDraft(value);
    updateMyPresence({ typing: value.length > 0 });
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () => updateMyPresence({ typing: false }),
      1500,
    );
  }

  function submit() {
    const body = draft.trim();
    if (!body) return;
    sendMessage(body);
    setDraft("");
    updateMyPresence({ typing: false });
  }

  if (!isOpen) return null;

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Chat
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close chat"
          className="h-6 w-6"
          onClick={close}
        >
          <FiX size={15} />
        </Button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {list.length === 0 ? (
          <p className="pt-6 text-center text-xs text-zinc-400">
            No messages yet. Say hello 👋
          </p>
        ) : (
          list.map((m) => (
            <ChatMessageRow key={m.id} message={m} isSelf={m.userId === selfId} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {typingUsers.length > 0 && (
        <p className="px-3 pb-1 text-xs italic text-zinc-400">
          {typingUsers.slice(0, 2).join(", ")}
          {typingUsers.length > 2 ? " and others" : ""} typing…
        </p>
      )}

      <div className="flex items-center gap-2 border-t border-zinc-200 p-2 dark:border-zinc-800">
        <Input
          value={draft}
          placeholder="Message…"
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          className="h-9"
        />
        <Button
          size="icon"
          aria-label="Send"
          disabled={!draft.trim()}
          onClick={submit}
          className="h-9 w-9 shrink-0"
        >
          <FiSend size={15} />
        </Button>
      </div>
    </aside>
  );
}
