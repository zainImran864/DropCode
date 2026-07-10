"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  passwordSchema,
  type PasswordInput,
} from "@/lib/validations/profile";
import { useProfile } from "@/hooks/use-profile";

export function PasswordForm() {
  const { changePassword, savingPassword } = useProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordInput>({ resolver: zodResolver(passwordSchema) });

  function onSubmit(values: PasswordInput) {
    changePassword(values.password);
    reset();
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Password</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Set a new password for your account.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 flex max-w-sm flex-col gap-4"
      >
        <FormField
          id="password"
          type="password"
          label="New password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <FormField
          id="confirm"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          error={errors.confirm?.message}
          {...register("confirm")}
        />
        <Button type="submit" size="sm" disabled={savingPassword}>
          {savingPassword ? "Updating…" : "Update password"}
        </Button>
      </form>
    </Card>
  );
}
