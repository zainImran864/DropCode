import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Content-aware skeletons that match the real dashboard components' shapes. */

export function StatCardSkeleton() {
  return (
    <Card className="p-5">
      <Skeleton className="h-9 w-9 rounded-lg" />
      <Skeleton className="mt-4 h-7 w-16" />
      <Skeleton className="mt-2 h-3 w-24" />
    </Card>
  );
}

export function ChartCardSkeleton() {
  return (
    <Card className="p-5">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-2 h-3 w-40" />
      <Skeleton className="mt-4 h-56 w-full" />
    </Card>
  );
}

export function WorkspaceCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-3 w-24" />
      <Skeleton className="mt-2 h-3 w-20" />
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <WorkspaceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
