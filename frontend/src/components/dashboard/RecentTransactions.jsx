import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { currency, formatDate } from "@/lib/utils";

export function RecentTransactions({ items = [] }) {
  return (
    <Card className="rounded-[32px] p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--muted)]">Recent transactions</p>
          <h3 className="mt-2 text-xl font-semibold">Latest record activity</h3>
        </div>
      </div>
      <div className="space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-[24px] border border-white/8 bg-white/5 p-4 light:border-slate-200 light:bg-white/70 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-medium">{item.category}</p>
                  <Badge tone={item.type === "INCOME" ? "success" : "warning"}>{item.type}</Badge>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{item.notes || "No notes provided"}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-lg font-semibold">{currency(item.amount)}</p>
                <p className="text-sm text-[var(--muted)]">{formatDate(item.date)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--muted)]">No transactions yet.</p>
        )}
      </div>
    </Card>
  );
}
