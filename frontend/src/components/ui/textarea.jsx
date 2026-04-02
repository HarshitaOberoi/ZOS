import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-sky-300/60 focus:ring-4 focus:ring-[var(--ring)] light:border-slate-200 light:bg-white",
        className
      )}
      {...props}
    />
  );
});
