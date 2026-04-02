import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-sky-300/60 focus:ring-4 focus:ring-[var(--ring)] light:border-slate-200 light:bg-white",
        className
      )}
      {...props}
    />
  );
});
