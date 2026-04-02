import { LoaderCircle } from "lucide-react";

export function FullScreenLoader({ label = "Loading" }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel flex w-full max-w-md flex-col items-center gap-4 rounded-[32px] px-8 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-400/10 text-sky-300">
          <LoaderCircle className="h-8 w-8 animate-spin" />
        </div>
        <div>
          <p className="text-lg font-semibold">{label}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Syncing finance data and preparing your workspace.</p>
        </div>
      </div>
    </div>
  );
}
