import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, MoonStar, ShieldCheck, SunMedium, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NAV_ITEMS, ROLE_COPY } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AppShell() {
  const { user, logout, theme, setTheme } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = useMemo(
    () => NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user?.role)),
    [user?.role]
  );

  const content = (
    <>
      <div className="mb-10 flex items-center justify-between lg:hidden">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 via-cyan-400 to-amber-300 text-slate-950 shadow-lg shadow-cyan-500/20">
            <WalletCards className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] text-sky-200/80">ZORVYN</p>
            <p className="text-xs text-[var(--muted)]">Finance OS</p>
          </div>
        </Link>
        <Button variant="secondary" size="icon" onClick={() => setMobileOpen((value) => !value)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex min-h-screen gap-6 px-4 py-4 md:px-6 lg:px-8 lg:py-8">
        <aside
          className={cn(
            "glass-panel fixed inset-y-4 left-4 z-30 w-[290px] rounded-[32px] p-6 transition duration-300 lg:static lg:block lg:w-[300px]",
            mobileOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"
          )}
        >
          <div className="flex h-full flex-col">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 via-cyan-400 to-amber-300 text-slate-950 shadow-lg shadow-cyan-500/20">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.3em] text-sky-200/80">ZORVYN</p>
                <p className="text-xs text-[var(--muted)]">Finance intelligence</p>
              </div>
            </Link>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5 light:border-slate-200 light:bg-white/70">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{user?.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{user?.email}</p>
                </div>
                <Badge tone={user?.role === "ADMIN" ? "warning" : user?.role === "ANALYST" ? "info" : "default"}>
                  {user?.role}
                </Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{ROLE_COPY[user?.role]}</p>
            </div>

            <nav className="mt-8 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-2xl px-4 py-3 text-sm transition",
                      isActive
                        ? "bg-white/12 text-white shadow-lg shadow-sky-500/10 light:bg-sky-50 light:text-sky-900"
                        : "text-[var(--muted)] hover:bg-white/8 hover:text-[var(--foreground)] light:hover:bg-slate-900/5"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto space-y-3">
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-[var(--foreground)] transition hover:bg-white/8 light:border-slate-200 light:hover:bg-slate-900/5"
              >
                <span>Theme mode</span>
                {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => logout()}
                className="flex w-full items-center justify-between rounded-2xl border border-rose-500/20 bg-rose-500/8 px-4 py-3 text-sm text-rose-200 transition hover:bg-rose-500/15 light:text-rose-700"
              >
                <span>Sign out</span>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          />
        ) : null}

        <main className="min-w-0 flex-1">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="pb-10"
          >
            <div className="mb-6 hidden items-center justify-between lg:flex">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-sky-200/70 light:text-sky-700">Premium workspace</p>
                <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Operations control for modern finance teams</h1>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--muted)] light:border-slate-200 light:bg-white/80">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                JWT session secure
              </div>
            </div>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </>
  );

  return content;
}
