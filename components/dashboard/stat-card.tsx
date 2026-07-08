import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
}

/** Reusable metric tile for the dashboard. */
export function StatCard({ icon, label, value, hint }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
        {icon}
      </div>
      <p className="mt-4 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
      {hint ? <p className="mt-0.5 text-xs text-zinc-400">{hint}</p> : null}
    </Card>
  );
}
