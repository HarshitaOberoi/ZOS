import { useEffect, useState } from "react";
import { FolderSearch } from "lucide-react";
import { CashflowChart } from "@/components/charts/CashflowChart";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { EmptyState } from "@/components/ui/EmptyState";
import { dashboardService } from "@/services/api";

export function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        const response = await dashboardService.summary();
        if (active) setSummary(response);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSummary();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const hasData = (summary?.recentTransactions?.length || 0) > 0 || (summary?.monthlySummary?.length || 0) > 0;

  if (!hasData) {
    return (
      <EmptyState
        icon={FolderSearch}
        title="No finance records yet"
        description="Create your first income or expense entry from the records page to unlock trend analysis, category insights, and balance metrics."
      />
    );
  }

  const incomeDelta = summary.totalIncome === 0 ? "$0" : `${Math.round((summary.netBalance / summary.totalIncome) * 100)}% balance efficiency`;
  const expenseDelta = summary.totalExpenses === 0 ? "$0" : `${summary.recentTransactions.length} recent movements`;

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[36px] p-7 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr] xl:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-200/80 light:text-sky-700">Financial overview</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
              A live, role-aware cockpit for revenue, spend, and operating momentum.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Monitor cash health, spot category concentration, and keep the team aligned with a polished interface tuned to every permission level.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 light:border-slate-200 light:bg-white/70">
              <p className="text-sm text-[var(--muted)]">Recent transactions</p>
              <p className="mt-2 text-3xl font-semibold">{summary.recentTransactions.length}</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 light:border-slate-200 light:bg-white/70">
              <p className="text-sm text-[var(--muted)]">Tracked categories</p>
              <p className="mt-2 text-3xl font-semibold">{Object.keys({ ...summary.categoryTotals.income, ...summary.categoryTotals.expense }).length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total income" value={summary.totalIncome} delta={incomeDelta} accent="#38bdf8" positive />
        <MetricCard label="Total expenses" value={summary.totalExpenses} delta={expenseDelta} accent="#f97316" positive={false} />
        <MetricCard label="Net balance" value={summary.netBalance} delta={summary.netBalance >= 0 ? "Healthy runway" : "Spending exceeds intake"} accent="#22c55e" positive={summary.netBalance >= 0} />
        <MetricCard label="Avg. monthly net" value={(summary.monthlySummary || []).reduce((sum, item) => sum + item.net, 0) / Math.max(summary.monthlySummary.length, 1)} delta="Trend across tracked months" accent="#f59e0b" positive />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <CashflowChart data={summary.monthlySummary} />
        <CategoryPieChart totals={summary.categoryTotals} />
      </section>

      <RecentTransactions items={summary.recentTransactions} />
    </div>
  );
}
