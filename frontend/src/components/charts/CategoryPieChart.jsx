import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { currency } from "@/lib/utils";

const COLORS = ["#38bdf8", "#7dd3fc", "#f59e0b", "#22c55e", "#f97316", "#8b5cf6"];

export function CategoryPieChart({ totals = {} }) {
  const data = Object.entries({ ...totals.income, ...totals.expense }).map(([name, value]) => ({ name, value }));

  return (
    <Card className="rounded-[32px] p-6 h-auto w-full">
      <div className="mb-6">
        <p className="text-sm text-[var(--muted)]">Category distribution</p>
        <h3 className="mt-2 text-xl font-semibold">Where the money moves</h3>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:items-center">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={3}>
                {data.map((item, index) => (
                  <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => currency(value)}
                contentStyle={{
                  background: "rgba(5, 12, 24, 0.9)",
                  border: "1px solid rgba(148,163,184,0.18)",
                  borderRadius: "18px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.length ? (
            data.slice(0, 6).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 light:border-slate-200 light:bg-white/70">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{currency(item.value)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)]">No category data yet.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
