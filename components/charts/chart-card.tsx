import { Card } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

/** Consistent titled container for any chart. */
export function ChartCard({ title, subtitle, action, children }: ChartCardProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle ? (
            <p className="text-xs text-zinc-500">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="h-56 w-full">{children}</div>
    </Card>
  );
}
