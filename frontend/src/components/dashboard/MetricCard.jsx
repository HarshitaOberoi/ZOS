import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { currency } from "@/lib/utils";

export function MetricCard({ label, value, delta, positive = true, accent }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.22 }} className="w-full">
      <Card className="metric-shine rounded-[30px] p-6 h-auto">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--muted)]">{label}</p>
            <p className="mt-4 text-3xl font-semibold">{currency(value)}</p>
          </div>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${accent}18`, color: accent }}
          >
            {positive ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm">
          <span className={positive ? "text-emerald-300 light:text-emerald-700" : "text-rose-300 light:text-rose-700"}>
            {delta}
          </span>
          <span className="text-[var(--muted)]">from recent activity</span>
        </div>
      </Card>
    </motion.div>
  );
}
