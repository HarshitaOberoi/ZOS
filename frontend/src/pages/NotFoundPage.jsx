import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <EmptyState
        title="Page not found"
        description="The page you requested has drifted out of this dashboard workspace. Head back to the overview and continue from there."
        action={
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-medium text-slate-950 transition hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Return home
          </Link>
        }
      />
    </div>
  );
}
