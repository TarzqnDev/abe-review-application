import { Skeleton } from "@/components/ui/skeleton";

export default function McqQuizInitialSkeleton() {
  return (
    <div role="status" aria-label="Loading MCQ quizzes">
      <span className="sr-only">Loading MCQ quizzes...</span>

      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-primary-text">
          MCQ Quizzes
        </h1>
        <p className="mt-1 text-base text-secondary-text">
          Choose a game to start answering quizzes
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, cardIndex) => (
          <article
            key={cardIndex}
            className="overflow-hidden rounded-lg border border-border bg-surface"
          >
            <Skeleton className="h-[150px] w-full rounded-none" />

            <div className="p-5 pt-3">
              <Skeleton className="h-5 w-32" />
              <div className="mt-1 space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="mt-3 h-10 w-full rounded" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
