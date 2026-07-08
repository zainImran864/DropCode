import { requireUser } from "@/lib/auth";

/** Server-side guard for all authenticated routes. */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser(); // redirects to /login if signed out
  return <div className="flex flex-1 flex-col">{children}</div>;
}
