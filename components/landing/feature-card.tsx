import { Card } from "@/components/ui/card";

export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-5 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-zinc-500">{description}</p>
    </Card>
  );
}
