import { Skeleton } from "@/components/ui/skeleton";

export default function FlashCardDecksSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-5 lg:grid-cols-2"
      aria-label="Loading flash card areas"
      role="status"
    >
      {Array.from({ length: 3 }, (_, skeletonIndex) => (
        <div
          key={skeletonIndex}
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <Skeleton className="h-5 w-20" />
          <div className="mt-5 flex items-center justify-between gap-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="mt-2 h-px w-full rounded-none" />
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading flash card areas</span>
    </div>
  );
}
