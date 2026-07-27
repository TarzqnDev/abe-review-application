export default function TriviaListSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading trivias" role="status">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <div className="h-7 w-40 rounded bg-border" />
        <div className="h-6 w-20 rounded-full bg-teal-50" />
      </div>
      <div className="mt-5 space-y-2">
        {Array.from({ length: 4 }, (_, itemIndex) => (
          <div
            key={itemIndex}
            className="h-32 rounded-lg border border-border bg-surface p-5"
          >
            <div className="h-4 w-28 rounded bg-border" />
            <div className="mt-3 h-3 w-36 rounded bg-slate-100" />
            <div className="mt-5 h-3 w-full rounded bg-slate-100" />
            <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading trivias</span>
    </div>
  );
}
