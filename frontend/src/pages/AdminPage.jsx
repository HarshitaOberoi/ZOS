import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_COPY, ROLES, STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { userService } from "@/services/api";

export function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const response = await userService.list();
      setUsers(response || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function updateUser(id, patch) {
    setSavingId(id);
    try {
      await userService.update(id, patch);
      toast.success("User updated successfully.");
      await loadUsers();
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[36px] p-7 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-200/80 light:text-sky-700">Admin control center</p>
            <h2 className="mt-4 text-4xl font-semibold">Manage access, roles, and account status with confidence.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Keep your finance operation secure by promoting the right people, disabling stale access, and maintaining clean role boundaries.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200 light:text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
            Admin-only controls
          </div>
        </div>
      </section>

      <Card className="overflow-hidden rounded-[32px] p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/6 text-[var(--muted)] light:border-slate-200 light:bg-slate-50/80">
              <tr>
                {['User', 'Role', 'Status', 'Created', 'Permission summary'].map((heading) => (
                  <th key={heading} className="px-6 py-4 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b border-white/6 light:border-slate-200/70">
                      <td className="px-6 py-5" colSpan={5}>
                        <Skeleton className="h-16 w-full rounded-[20px]" />
                      </td>
                    </tr>
                  ))
                : users.map((user) => (
                    <tr key={user.id} className="border-b border-white/6 last:border-b-0 light:border-slate-200/70">
                      <td className="px-6 py-5">
                        <p className="font-medium">{user.name}</p>
                        <p className="mt-1 text-[var(--muted)]">{user.email}</p>
                      </td>
                      <td className="px-6 py-5">
                        <Select
                          value={user.role}
                          disabled={savingId === user.id}
                          onChange={(event) => updateUser(user.id, { role: event.target.value })}
                        >
                          {Object.values(ROLES).map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </Select>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Badge tone={user.status === STATUSES.ACTIVE ? 'success' : 'danger'}>{user.status}</Badge>
                          <Select
                            value={user.status}
                            disabled={savingId === user.id}
                            onChange={(event) => updateUser(user.id, { status: event.target.value })}
                          >
                            {Object.values(STATUSES).map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </Select>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[var(--muted)]">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-5 text-[var(--muted)]">{ROLE_COPY[user.role]}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
