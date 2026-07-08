"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { logout } = useAuth();
  return (
    <Button variant="outline" size="sm" onClick={logout}>
      Log out
    </Button>
  );
}
