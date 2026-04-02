import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/app/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_OPTIONS, RECORD_TYPES, ROLES } from "@/lib/constants";

const schema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  type: z.enum([RECORD_TYPES.INCOME, RECORD_TYPES.EXPENSE]),
  category: z.string().min(2, "Category is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

const defaultValues = {
  amount: "",
  type: RECORD_TYPES.INCOME,
  category: CATEGORY_OPTIONS[0],
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export function RecordFormModal({ open, onClose, initialValues, onSubmit }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const canEdit = user?.role === ROLES.ADMIN || user?.role === ROLES.ANALYST;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(
      initialValues
        ? {
            amount: initialValues.amount,
            type: initialValues.type,
            category: initialValues.category,
            date: initialValues.date?.slice(0, 10),
            notes: initialValues.notes || "",
          }
        : defaultValues
    );
  }, [form, initialValues, open]);

  async function handleSave(values) {
    if (!canEdit) {
      toast.error("You do not have permission to modify records.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        ...values,
        amount: Number(values.amount),
      });
      onClose();
      form.reset(defaultValues);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValues ? "Edit finance record" : "Create finance record"}
      description="Capture a clean record with the right metadata so the dashboard stays meaningful and trustworthy."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={form.handleSubmit(handleSave)} disabled={saving || !canEdit}>
            {saving ? "Saving..." : initialValues ? "Save changes" : "Create record"}
          </Button>
        </>
      }
    >
      <form className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-[var(--muted)]">Amount</label>
          <Input type="number" step="0.01" {...form.register("amount")} />
          {form.formState.errors.amount ? <p className="mt-2 text-sm text-rose-300">{form.formState.errors.amount.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--muted)]">Type</label>
          <Select {...form.register("type")}>
            <option value={RECORD_TYPES.INCOME}>Income</option>
            <option value={RECORD_TYPES.EXPENSE}>Expense</option>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--muted)]">Category</label>
          <Select {...form.register("category")}>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--muted)]">Date</label>
          <Input type="date" {...form.register("date")} />
          {form.formState.errors.date ? <p className="mt-2 text-sm text-rose-300">{form.formState.errors.date.message}</p> : null}
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-[var(--muted)]">Notes</label>
          <Textarea placeholder="Quarterly payroll adjustment" {...form.register("notes")} />
        </div>
      </form>
    </Modal>
  );
}
