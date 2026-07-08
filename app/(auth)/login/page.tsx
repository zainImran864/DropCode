import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="text-sm text-zinc-500">Log in to your DropCode account.</p>
      </div>
      <LoginForm next={next} />
      <p className="text-center text-sm text-zinc-500">
        No account?{" "}
        <Link href="/register" className="font-medium underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
