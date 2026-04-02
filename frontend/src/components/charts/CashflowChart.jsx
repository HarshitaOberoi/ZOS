import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { currency, formatMonthLabel } from "@/lib/utils";

export function CashflowChart({ data = [] }) {
  const chartData = [...data].reverse().map((item) => ({
    ...item,
    label: formatMonthLabel(item.month),
  }));

  return (
    <Card className="rounded-[32px] p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">Cashflow trajectory</p>
          <h3 className="mt-2 text-xl font-semibold">Income vs. expenses</h3>
        </div>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: -20, right: 16, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.34} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#8fa2bf", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8fa2bf", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
            <Tooltip
              contentStyle={{
                background: "rgba(5, 12, 24, 0.9)",
                border: "1px solid rgba(148,163,184,0.18)",
                borderRadius: "18px",
              }}
              formatter={(value) => currency(value)}
            />
            <Area type="monotone" dataKey="income" stroke="#38bdf8" fill="url(#incomeFill)" strokeWidth={3} />
            <Area type="monotone" dataKey="expense" stroke="#f97316" fill="url(#expenseFill)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
