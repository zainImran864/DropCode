"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as authApi from "@/api/auth";
import { useUserStore } from "@/store/user-store";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";

/**
 * Hook layer — wraps the auth API with navigation, toasts, and loading state
 * for the login/register/logout forms to consume.
 */
export function useAuth() {
  const router = useRouter();
  const reset = useUserStore((s) => s.reset);
  const [isPending, setPending] = useState(false);

  async function login(values: LoginInput, next?: string) {
    setPending(true);
    const { error } = await authApi.signInWithPassword(values);
    setPending(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    // Only allow internal redirects.
    router.push(next && next.startsWith("/") ? next : "/dashboard");
    router.refresh();
  }

  async function register(values: RegisterInput) {
    setPending(true);
    const { data, error } = await authApi.signUpWithEmail(values);
    setPending(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    // Session present => email confirmation is off; otherwise ask them to verify.
    if (data.session) {
      toast.success("Account created!");
      router.push("/dashboard");
      router.refresh();
    } else {
      toast.success("Check your email to confirm your account.");
      router.push("/login");
    }
  }

  async function logout() {
    await authApi.signOut();
    reset();
    router.push("/");
    router.refresh();
  }

  return { login, register, logout, isPending };
}
