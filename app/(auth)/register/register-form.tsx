"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/use-auth";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const { register: registerUser, isPending } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  return (
    <form onSubmit={handleSubmit(registerUser)} className="flex flex-col gap-4">
      <FormField
        id="displayName"
        label="Name"
        autoComplete="name"
        placeholder="Ada Lovelace"
        error={errors.displayName?.message}
        {...register("displayName")}
      />
      <FormField
        id="email"
        type="email"
        label="Email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormField
        id="password"
        type="password"
        label="Password"
        autoComplete="new-password"
        placeholder="At least 6 characters"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" disabled={isPending} className="mt-1 w-full">
        {isPending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
