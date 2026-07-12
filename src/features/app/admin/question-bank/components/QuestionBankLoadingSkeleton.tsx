import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionBankLoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading subject areas">
      <div className="mb-12 rounded-md border border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="mt-5 h-6 w-48" />
          <Skeleton className="mt-3 h-4 w-64 max-w-full" />
          <Skeleton className="mt-8 h-11 w-full" />
        </div>
      </div>

      <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-5">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-12 w-full" />
      <span className="sr-only">Loading subject areas...</span>
    </div>
  );
}
