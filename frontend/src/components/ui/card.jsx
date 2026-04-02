import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[28px] border border-white/10 bg-white/5 p-6 text-[var(--foreground)] light:border-slate-200 light:bg-white/80",
        className
      )}
      {...props}
    />
  );
}
