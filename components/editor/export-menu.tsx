"use client";

import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditorStore } from "@/store/editor-store";
import { getWorkspaceFilesForExport } from "@/app/(app)/file-actions";

function download(filename: string, content: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface Props {
  workspaceId: string;
  workspaceName: string;
  activeFileName?: string;
}

export function ExportMenu({
  workspaceId,
  workspaceName,
  activeFileName,
}: Props) {
  const getContent = useEditorStore((s) => s.getContent);
  const [busy, setBusy] = useState(false);

  function exportCurrent() {
    if (!getContent || !activeFileName) {
      toast.error("Open a file to export it.");
      return;
    }
    download(activeFileName, getContent(), "text/plain");
  }

  async function exportAll() {
    setBusy(true);
    try {
      const res = await getWorkspaceFilesForExport(workspaceId);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      if (res.data.length === 0) {
        toast.error("No files to export.");
        return;
      }
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const file of res.data) zip.file(file.name, file.content);
      const blob = await zip.generateAsync({ type: "blob" });
      const safe = workspaceName.replace(/[^a-z0-9-_]+/gi, "_");
      download(`${safe || "workspace"}.zip`, blob, "application/zip");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={busy}>
          <FiDownload size={15} className="mr-1.5" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={exportCurrent}>
          Current file
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={exportAll}>
          Whole workspace (.zip)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
