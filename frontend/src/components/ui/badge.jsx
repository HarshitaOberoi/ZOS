import { cn, sentenceCase } from "@/lib/utils";

const toneClasses = {
  default: "border-white/10 bg-white/5 text-[var(--foreground)]",
  success: "border-emerald-500/25 bg-emerald-500/12 text-emerald-300 light:text-emerald-700",
  warning: "border-amber-500/25 bg-amber-500/12 text-amber-300 light:text-amber-700",
  info: "border-sky-500/25 bg-sky-500/12 text-sky-300 light:text-sky-700",
  danger: "border-rose-500/25 bg-rose-500/12 text-rose-300 light:text-rose-700",
};

export function Badge({ children, tone = "default", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {typeof children === "string" ? sentenceCase(children) : children}
    </span>
  );
}
