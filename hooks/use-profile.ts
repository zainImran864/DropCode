"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { updateProfileAction } from "@/app/(app)/profile-actions";

/** Hook layer — profile picture upload, name save, and password change. */
export function useProfile() {
  const router = useRouter();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function uploadAvatar(
    userId: string,
    file: File,
  ): Promise<string | null> {
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${userId}/avatar.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      toast.error(error.message);
      return null;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    // cache-bust so the new image shows immediately
    return `${data.publicUrl}?t=${Date.now()}`;
  }

  async function saveProfile(opts: {
    userId: string;
    name: string;
    file: File | null;
  }) {
    setSavingProfile(true);
    let avatarUrl: string | undefined;
    if (opts.file) {
      const url = await uploadAvatar(opts.userId, opts.file);
      if (!url) {
        setSavingProfile(false);
        return;
      }
      avatarUrl = url;
    }
    const res = await updateProfileAction({ displayName: opts.name, avatarUrl });
    setSavingProfile(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Profile updated");
    router.refresh();
  }

  async function changePassword(password: string) {
    setSavingPassword(true);
    const { error } = await createClient().auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
  }

  return { saveProfile, changePassword, savingProfile, savingPassword };
}
