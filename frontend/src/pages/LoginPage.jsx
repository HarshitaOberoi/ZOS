import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgeDollarSign,
  ChartNoAxesCombined,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    email: "admin@zorvyn.io",
    password: "Admin@123",
    description: "Full access including user management.",
  },
  {
    role: "Analyst",
    email: "analyst@zorvyn.io",
    password: "Analyst@123",
    description: "Can create and manage finance records.",
  },
  {
    role: "Viewer",
    email: "viewer@zorvyn.io",
    password: "Viewer@123",
    description: "Read-only access for dashboard review.",
  },
];

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      await login(values);
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setSubmitting(false);
    }
  }

  function applyDemoAccount(account) {
    setValue("email", account.email, { shouldValidate: true });
    setValue("password", account.password, { shouldValidate: true });
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[8%] h-72 w-72 rounded-full bg-cyan-400/14 blur-3xl" />
        <div className="absolute right-[-4%] top-[18%] h-80 w-80 rounded-full bg-amber-400/14 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[30%] h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1500px] gap-8 xl:grid-cols-[1.12fr_0.88fr]">
        <section className="glass-panel relative overflow-hidden rounded-[40px] p-7 md:p-10 xl:p-12">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/50 to-transparent" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.32em] text-sky-100/80 light:border-slate-200 light:bg-white/80 light:text-sky-800">
              <Sparkles className="h-3.5 w-3.5" />
              Zorvyn Finance OS
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-200 light:text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure role-aware workspace
            </div>
          </div>

          <div className="mt-10 grid gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
            <div>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-gradient md:text-6xl xl:text-7xl">
                Finance control that feels cinematic, fast, and unmistakably premium.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] md:text-lg">
                Zorvyn turns revenue, expense, and role-based operations into a sharper first-glance experience. Sign in as
                a Viewer, Analyst, or Admin to explore protected analytics, guided record workflows, and permission-aware UI.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#demo-accounts"
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/14 light:border-slate-200 light:bg-white"
                >
                  Explore demo roles
                </a>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-5 py-3 text-sm font-medium text-sky-100 transition hover:bg-sky-400/15 light:text-sky-800"
                >
                  Create a viewer account
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    value: "3",
                    label: "permission tiers",
                    copy: "Viewer, Analyst, and Admin with focused access.",
                  },
                  {
                    value: "5s",
                    label: "demo sign-in",
                    copy: "Fill a test account and explore instantly.",
                  },
                  {
                    value: "Live",
                    label: "business insight",
                    copy: "Income, spend, and balance at a glance.",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="min-w-0 rounded-[28px] border border-white/10 bg-white/6 p-5 sm:min-h-[220px] light:border-slate-200 light:bg-white/75"
                  >
                    <p className="text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">{item.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-sky-200/75 light:text-sky-700">{item.label}</p>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.16),_transparent_45%),rgba(255,255,255,0.04)] p-6 light:border-slate-200 light:bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_42%),rgba(255,255,255,0.82)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-sky-200/75 light:text-sky-700">Operational lens</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">A sharper way to enter the product</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/12 text-sky-200 light:text-sky-700">
                    <ChartNoAxesCombined className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Protected routes and JWT session restoration",
                    "Role-safe actions before and after login",
                    "Analytics-backed dashboard with recent record activity",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-[22px] border border-white/8 bg-slate-950/24 px-4 py-3 light:border-slate-200 light:bg-white"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300 light:text-emerald-700" />
                      <p className="text-sm leading-6 text-[var(--foreground)]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)]">
                <div className="rounded-[30px] border border-white/10 bg-white/6 p-6 md:min-h-[220px] light:border-slate-200 light:bg-white/75">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/12 text-amber-200 light:text-amber-700">
                    <BadgeDollarSign className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-lg font-semibold">Finance hub</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Track totals, trends, and category spend in one place.
                  </p>
                </div>
                <div className="rounded-[30px] border border-white/10 bg-white/6 p-6 md:min-h-[220px] light:border-slate-200 light:bg-white/75">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-200 light:text-emerald-700">
                    <Users className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-lg font-semibold">Role-aware team</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Analysts edit, admins manage, viewers stay read-only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-stretch justify-center">
          <Card className="relative w-full max-w-2xl overflow-hidden rounded-[40px] p-8 md:p-10">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent light:via-sky-300/70" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-200/80 light:text-sky-700">Secure access</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Step into the workspace</h2>
                <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--muted)]">
                  Sign in with your credentials or use a demo role to preview permission-aware finance operations.
                </p>
              </div>
              <div className="flex h-13 w-13 items-center justify-center rounded-[22px] bg-emerald-500/12 text-emerald-300 light:text-emerald-700">
                <LockKeyhole className="h-5 w-5" />
              </div>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-2 block text-sm text-[var(--muted)]">Email</label>
                <Input placeholder="admin@zorvyn.io" {...register("email")} />
                {errors.email ? <p className="mt-2 text-sm text-rose-300">{errors.email.message}</p> : null}
              </div>
              <div>
                <label className="mb-2 block text-sm text-[var(--muted)]">Password</label>
                <Input type="password" placeholder="Enter your password" {...register("password")} />
                {errors.password ? <p className="mt-2 text-sm text-rose-300">{errors.password.message}</p> : null}
              </div>
              <Button className="w-full" size="lg" disabled={submitting}>
                {submitting ? "Signing in..." : "Open dashboard"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div id="demo-accounts" className="mt-6 rounded-[30px] border border-white/10 bg-white/5 p-5 light:border-slate-200 light:bg-white/70">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-200/75 light:text-sky-700">Demo accounts</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Try each role in seconds and compare what changes across the product.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-[var(--muted)] light:border-slate-200 light:bg-white">
                  1-click fill
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => applyDemoAccount(account)}
                    className="w-full rounded-[24px] border border-white/10 bg-slate-950/35 p-4 text-left transition hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-white/8 light:border-slate-200 light:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{account.role}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{account.description}</p>
                      </div>
                      <span className="rounded-full bg-sky-400/12 px-3 py-1 text-xs text-sky-200 light:text-sky-700">
                        Use account
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-[var(--muted)] md:grid-cols-2">
                      <span className="rounded-full border border-white/8 px-3 py-2 light:border-slate-200">{account.email}</span>
                      <span className="rounded-full border border-white/8 px-3 py-2 light:border-slate-200">{account.password}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 rounded-[28px] border border-white/10 bg-white/4 p-5 light:border-slate-200 light:bg-white/60">
              <p className="text-sm uppercase tracking-[0.22em] text-sky-200/75 light:text-sky-700">What you can test today</p>
              {[
                "Create and edit finance records with Analyst and Admin access",
                "Review charts, totals, and recent activity across the dashboard",
                "Manage user roles and statuses from the admin control surface",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300 light:text-emerald-700" />
                  <p className="text-sm leading-6 text-[var(--muted)]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--muted)]">
              <span>New here?</span>
              <Link to="/register" className="text-sky-300 transition hover:text-sky-200 light:text-sky-700">
                Create a viewer account
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
