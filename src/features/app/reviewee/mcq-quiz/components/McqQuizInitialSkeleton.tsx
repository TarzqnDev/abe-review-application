export default function McqQuizInitialSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading MCQ quizzes"
      className="animate-pulse"
    >
      <span className="sr-only">Loading MCQ quizzes...</span>

      <div className="mb-8 space-y-2">
        <div className="h-7 w-40 rounded bg-slate-200" />
        <div className="h-5 w-72 max-w-full rounded bg-slate-200" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, cardIndex) => (
          <div
            key={cardIndex}
            className="h-48 rounded-md border border-border bg-surface"
          />
        ))}
      </div>
    </div>
  );
}
