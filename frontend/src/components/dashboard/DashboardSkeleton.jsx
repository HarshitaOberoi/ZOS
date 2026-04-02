import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-[30px] p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-5 h-10 w-40" />
            <Skeleton className="mt-6 h-4 w-36" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="rounded-[32px] p-6">
          <Skeleton className="mb-6 h-5 w-48" />
          <Skeleton className="h-[320px] w-full" />
        </Card>
        <Card className="rounded-[32px] p-6">
          <Skeleton className="mb-6 h-5 w-44" />
          <Skeleton className="h-[320px] w-full" />
        </Card>
      </div>
      <Card className="rounded-[32px] p-6">
        <Skeleton className="mb-6 h-5 w-44" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-[24px]" />
          ))}
        </div>
      </Card>
    </div>
  );
}
