import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-slate-950 shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 hover:bg-[var(--primary-strong)]",
        secondary:
          "border border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10 light:border-slate-200 light:bg-white light:text-slate-900",
        ghost:
          "text-[var(--foreground)] hover:bg-white/8 light:hover:bg-slate-900/5",
        danger:
          "bg-[var(--danger)] text-white hover:-translate-y-0.5 hover:brightness-110",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? "span" : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
