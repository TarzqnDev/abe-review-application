import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityHistorySkeleton() {
  return (
    <div aria-label="Loading activity history" className="animate-pulse">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-lg border border-border bg-surface p-5">
        <Skeleton className="h-4 w-28" />
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-[30px] w-28 rounded" />
          <Skeleton className="h-[30px] w-24 rounded" />
          <Skeleton className="h-[30px] w-24 rounded" />
        </div>
        <Skeleton className="mt-5 h-10 w-full rounded-full xl:ml-auto xl:w-[310px]" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-md" />
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
