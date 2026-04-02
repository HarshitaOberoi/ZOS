import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { currency, formatDate } from "@/lib/utils";

export function RecordsTable({ items, canEdit, canDelete, page, totalPages, onPageChange, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden rounded-[32px] p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/6 text-[var(--muted)] light:border-slate-200 light:bg-slate-50/80">
            <tr>
              {['Category', 'Type', 'Amount', 'Date', 'Notes', 'Actions'].map((heading) => (
                <th key={heading} className="px-6 py-4 font-medium">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((record) => (
              <tr key={record.id} className="border-b border-white/6 last:border-b-0 light:border-slate-200/70">
                <td className="px-6 py-5 font-medium">{record.category}</td>
                <td className="px-6 py-5"><Badge tone={record.type === 'INCOME' ? 'success' : 'warning'}>{record.type}</Badge></td>
                <td className="px-6 py-5">{currency(record.amount)}</td>
                <td className="px-6 py-5 text-[var(--muted)]">{formatDate(record.date)}</td>
                <td className="max-w-[320px] px-6 py-5 text-[var(--muted)]">{record.notes || 'No notes'}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    {canEdit ? (
                      <Button variant="secondary" size="icon" onClick={() => onEdit(record)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    ) : null}
                    {canDelete ? (
                      <Button variant="danger" size="icon" onClick={() => onDelete(record)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 px-6 py-4 text-sm text-[var(--muted)] light:border-slate-200 md:flex-row">
        <p>
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>Previous</Button>
          <Button variant="secondary" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>Next</Button>
        </div>
      </div>
    </Card>
  );
}
