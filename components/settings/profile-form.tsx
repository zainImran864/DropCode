"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { FiUpload } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/use-profile";

interface Props {
  userId: string;
  initialName: string;
  initialAvatar: string | null;
}

export function ProfileForm({ userId, initialName, initialAvatar }: Props) {
  const [name, setName] = useState(initialName);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialAvatar);
  const inputRef = useRef<HTMLInputElement>(null);
  const { saveProfile, savingProfile } = useProfile();

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Profile</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Update your picture and display name.
      </p>

      <div className="mt-5 flex items-center gap-4">
        <Avatar name={name} src={preview} className="h-16 w-16 text-lg" />
        <div className="flex flex-col gap-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <FiUpload size={14} className="mr-1.5" />
            Change picture
          </Button>
          <p className="text-xs text-zinc-400">PNG or JPG, up to 2MB.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Button
        className="mt-5"
        size="sm"
        disabled={savingProfile}
        onClick={() => saveProfile({ userId, name, file })}
      >
        {savingProfile ? "Saving…" : "Save changes"}
      </Button>
    </Card>
  );
}
