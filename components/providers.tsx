"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useUser } from "@/hooks/use-user";

/** Keeps the Zustand user store in sync with Supabase auth. Renders nothing. */
function UserSync() {
  useUser();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserSync />
      {children}
      <Toaster richColors position="bottom-right" />
    </ThemeProvider>
  );
}
