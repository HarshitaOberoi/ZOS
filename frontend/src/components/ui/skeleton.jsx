import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-white/8 light:bg-slate-900/6",
        className
      )}
    />
  );
}
