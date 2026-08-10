import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityHistorySkeleton() {
  return (
    <div aria-label="Loading activity history" className="animate-pulse">
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded border border-border bg-surface px-5 py-4"
          >
            <Skeleton className="mx-auto h-7 w-7 rounded" />
            <Skeleton className="mx-auto mt-2 h-6 w-16" />
            <Skeleton className="mx-auto mt-2 h-4 w-28" />
          </div>
        ))}
      </div>

      <div className="mb-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Skeleton className="h-5 w-44" />
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-[30px] w-28 rounded" />
              <Skeleton className="h-[30px] w-24 rounded" />
              <Skeleton className="h-[30px] w-24 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-full rounded-full xl:w-[275px]" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded border border-border bg-surface px-5 py-4"
          >
            <div className="flex items-center gap-5">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="hidden h-9 w-24 rounded sm:block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
