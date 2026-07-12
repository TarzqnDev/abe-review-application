import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectDetailsSkeleton() {
  return (
    <div aria-label="Loading questions" aria-live="polite" role="status">
      <Skeleton className="mb-2 h-5 w-24" />
      <div className="min-h-[135px] max-w-[280px] rounded border border-slate-200 bg-slate-50 px-2.5 py-4">
        <Skeleton className="mx-auto h-4 w-28" />
        <Skeleton className="mx-auto mt-4 h-5 w-8" />
        <Skeleton className="mx-auto mt-3 h-3 w-16" />
        <Skeleton className="mt-3 h-[30px] w-full" />
      </div>
      <span className="sr-only">Loading questions...</span>
    </div>
  );
}
