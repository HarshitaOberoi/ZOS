import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CATEGORY_OPTIONS } from "@/lib/constants";

export function RecordsToolbar({ filters, setFilters, canManage, onCreate }) {
  return (
    <div className="glass-panel rounded-[32px] p-5">
      <div className="grid gap-4 xl:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
            placeholder="Search category, notes, or type"
            className="pl-11"
          />
        </div>
        <Select value={filters.type} onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value, page: 1 }))}>
          <option value="">All types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </Select>
        <Select value={filters.category} onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value, page: 1 }))}>
          <option value="">All categories</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Select>
        <Input type="date" value={filters.startDate} onChange={(event) => setFilters((prev) => ({ ...prev, startDate: event.target.value, page: 1 }))} />
        <Input type="date" value={filters.endDate} onChange={(event) => setFilters((prev) => ({ ...prev, endDate: event.target.value, page: 1 }))} />
        <Select value={filters.sortBy} onChange={(event) => setFilters((prev) => ({ ...prev, sortBy: event.target.value }))}>
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
          <option value="category-asc">Category A-Z</option>
        </Select>
        <div className="flex items-center gap-3 xl:justify-end">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[var(--muted)] light:border-slate-200 light:bg-white">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          {canManage ? <Button onClick={onCreate}>New record</Button> : null}
        </div>
      </div>
    </div>
  );
}
