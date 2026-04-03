import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FolderSearch } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import { RecordFormModal } from "@/components/records/RecordFormModal";
import { RecordsTable } from "@/components/records/RecordsTable";
import { RecordsToolbar } from "@/components/records/RecordsToolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLES } from "@/lib/constants";
import { recordService } from "@/services/api";

const PAGE_SIZE = 8;

function applySort(items, sortBy) {
  const next = [...items];
  switch (sortBy) {
    case "date-asc":
      return next.sort((a, b) => new Date(a.date) - new Date(b.date));
    case "amount-desc":
      return next.sort((a, b) => b.amount - a.amount);
    case "amount-asc":
      return next.sort((a, b) => a.amount - b.amount);
    case "category-asc":
      return next.sort((a, b) => a.category.localeCompare(b.category));
    default:
      return next.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export function RecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    sortBy: "date-desc",
    page: 1,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });

  const canManage = [ROLES.ADMIN, ROLES.ANALYST].includes(user?.role);
  const canDelete = user?.role === ROLES.ADMIN;

  async function loadRecords() {
    setLoading(true);
    try {
      const response = await recordService.list({
        type: filters.type || undefined,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        search: filters.search || undefined,
        page: filters.page,
        limit: PAGE_SIZE,
      });
      setRecords(response.records || []);
      setPagination(response.pagination);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, [filters.type, filters.category, filters.startDate, filters.endDate, filters.search, filters.page]);

  const sortedRecords = useMemo(() => {
    return applySort(records, filters.sortBy);
  }, [filters.sortBy, records]);

  const totalPages = pagination.totalPages;
  const currentPage = filters.page;
  const paginatedRecords = sortedRecords;

  async function handleCreate(values) {
    try {
      await recordService.create(values);
      toast.success("Record created successfully.");
      setModalOpen(false);
      await loadRecords();
    } catch (error) {
      toast.error(error.message || "Failed to create record.");
    }
  }

  async function handleUpdate(values) {
    try {
      await recordService.update(editingRecord.id, values);
      toast.success("Record updated successfully.");
      setEditingRecord(null);
      setModalOpen(false);
      await loadRecords();
    } catch (error) {
      toast.error(error.message || "Failed to update record.");
    }
  }

  async function handleDelete(record) {
    await recordService.remove(record.id);
    toast.success(`${record.category} deleted.`);
    await loadRecords();
  }

  async function handleExport() {
    try {
      const blob = await recordService.exportCSV({
        type: filters.type || undefined,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        search: filters.search || undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `zorvyn-records-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Records exported to CSV.");
    } catch (error) {
      toast.error("Failed to export records.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[36px] p-7 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-200/80 light:text-sky-700">Records workspace</p>
            <h2 className="mt-4 text-4xl font-semibold">Advanced filtering, thoughtful forms, and role-safe actions.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Search quickly, narrow by type and date range, sort on demand, and manage records with production-style modal flows and feedback.
            </p>
          </div>
        </div>
      </section>

      <RecordsToolbar
        filters={filters}
        setFilters={setFilters}
        canManage={canManage}
        onCreate={() => {
          setEditingRecord(null);
          setModalOpen(true);
        }}
        onExport={handleExport}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-[28px]" />
          ))}
        </div>
      ) : records.length > 0 ? (
        <RecordsTable
          items={paginatedRecords}
          canEdit={canManage}
          canDelete={canDelete}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onEdit={(record) => {
            setEditingRecord(record);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState
          icon={FolderSearch}
          title="No records match these filters"
          description="Try broadening your filters or create a new record to start building meaningful analytics."
        />
      )}

      <RecordFormModal
        open={modalOpen}
        initialValues={editingRecord}
        onClose={() => {
          setModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={editingRecord ? handleUpdate : handleCreate}
      />
    </div>
  );
}
