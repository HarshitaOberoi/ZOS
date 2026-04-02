import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("glass-panel rounded-[32px] p-10 text-center", className)}>
      {Icon ? (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/8 text-sky-300 light:bg-sky-50 light:text-sky-700">
          <Icon className="h-8 w-8" />
        </div>
      ) : null}
      <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
