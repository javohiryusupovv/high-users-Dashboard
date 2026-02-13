// src/components/StatsBar.tsx
import { memo, useMemo } from "react";
import type { User } from "../types";

export const StatsBar = memo(function StatsBar({
  users,
  filteredCount,
}: {
  users: User[];
  filteredCount: number;
}) {
  const stats = useMemo(() => {
    const active = users.filter((u) => u.isActive).length;
    const avgSalary = users.reduce((s, u) => s + u.salary, 0) / (users.length || 1);
    return { total: users.length, active, avgSalary };
  }, [users]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard label="Total Users" value={stats.total.toLocaleString()} accent="violet" />
      <StatCard
        label="Active"
        value={`${stats.active.toLocaleString()} (${Math.round((stats.active / stats.total) * 100)}%)`}
        accent="emerald"
      />
      <StatCard label="Avg Salary" value={`$${Math.round(stats.avgSalary).toLocaleString()}`} accent="blue" />
      <StatCard label="Showing" value={`${filteredCount.toLocaleString()} rows`} accent="amber" />
    </div>
  );
});

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  const colors: Record<string, string> = {
    violet: "border-violet-500/20 bg-violet-500/5",
    emerald: "border-emerald-500/20 bg-emerald-500/5",
    blue: "border-blue-500/20 bg-blue-500/5",
    amber: "border-amber-500/20 bg-amber-500/5",
  };
  const textColors: Record<string, string> = {
    violet: "text-violet-400",
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    amber: "text-amber-400",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 ${colors[accent]}`}>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-lg font-semibold ${textColors[accent]}`}>{value}</div>
    </div>
  );
}
