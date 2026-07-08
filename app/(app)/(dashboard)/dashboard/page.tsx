import { FiFolder, FiUsers, FiStar, FiCode } from "react-icons/fi";
import { requireUser } from "@/lib/auth";
import { getWorkspaces, buildDashboardData } from "@/api/workspaces";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/charts/chart-card";
import { AreaTrendChart } from "@/components/charts/area-trend-chart";
import { BarStatChart } from "@/components/charts/bar-stat-chart";
import { WorkspaceGrid } from "@/components/workspace/workspace-grid";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";

export default async function DashboardPage() {
  const user = await requireUser();
  const workspaces = await getWorkspaces();
  const { stats, byLanguage, trend } = buildDashboardData(workspaces, user.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-zinc-500">
            Your workspaces and activity at a glance.
          </p>
        </div>
        <CreateWorkspaceDialog />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FiFolder size={18} />}
          label="Workspaces"
          value={stats.workspaceCount}
        />
        <StatCard
          icon={<FiStar size={18} />}
          label="Owned by you"
          value={stats.ownedCount}
        />
        <StatCard
          icon={<FiUsers size={18} />}
          label="Total members"
          value={stats.memberSeats}
        />
        <StatCard
          icon={<FiCode size={18} />}
          label="Languages used"
          value={stats.languageCount}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="New workspaces"
          subtitle="Created in the last 7 days"
        >
          <AreaTrendChart data={trend} />
        </ChartCard>
        <ChartCard title="By language" subtitle="Workspaces per language">
          {byLanguage.length > 0 ? (
            <BarStatChart data={byLanguage} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
              No data yet
            </div>
          )}
        </ChartCard>
      </div>

      {/* Workspaces */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Your workspaces</h2>
        <WorkspaceGrid workspaces={workspaces} userId={user.id} />
      </section>
    </div>
  );
}
