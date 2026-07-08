"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select } from "@/components/ui/select";
import { LANGUAGES, languageLabel } from "@/lib/languages";
import { updateWorkspaceLanguageAction } from "@/app/(app)/actions";

interface Props {
  workspaceId: string;
  language: string;
  canManage: boolean;
}

export function LanguageSwitcher({ workspaceId, language, canManage }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!canManage) {
    return (
      <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        {languageLabel(language)}
      </span>
    );
  }

  function onChange(value: string) {
    startTransition(async () => {
      const res = await updateWorkspaceLanguageAction(workspaceId, value);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Select
      aria-label="Language"
      value={language}
      disabled={isPending}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-32 py-0 text-xs"
    >
      {LANGUAGES.map((l) => (
        <option key={l.value} value={l.value}>
          {l.label}
        </option>
      ))}
    </Select>
  );
}
