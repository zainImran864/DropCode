import { Avatar } from "@/components/ui/avatar";
import type { ChatMessage } from "@/liveblocks.config";

export function ChatMessageRow({
  message,
  isSelf,
}: {
  message: ChatMessage;
  isSelf: boolean;
}) {
  return (
    <div className="flex gap-2">
      <Avatar name={message.name} className="mt-0.5 h-6 w-6" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-medium" style={{ color: message.color }}>
            {message.name}
            {isSelf && <span className="text-zinc-400"> (you)</span>}
          </span>
        </div>
        <p className="whitespace-pre-wrap break-words text-sm text-zinc-700 dark:text-zinc-300">
          {message.body}
        </p>
      </div>
    </div>
  );
}
