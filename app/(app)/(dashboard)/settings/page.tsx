import { requireUser } from "@/lib/auth";
import { getCurrentProfile } from "@/api/profile";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/password-form";

export default async function SettingsPage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-zinc-500">Manage your account.</p>
      </div>

      <ProfileForm
        userId={user.id}
        initialName={profile?.display_name ?? ""}
        initialAvatar={profile?.avatar_url ?? null}
      />

      <PasswordForm />

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Account</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Signed in as{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {user.email}
          </span>
        </p>
      </Card>
    </div>
  );
}
