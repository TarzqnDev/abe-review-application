export default function TriviaListSkeleton() {
  return (
    <div className="animate-pulse" aria-label="Loading trivias" role="status">
      <div className="h-7 w-48 rounded bg-slate-200" />
      <div className="mt-5 space-y-2">
        {Array.from({ length: 3 }, (_, itemIndex) => (
          <div
            key={itemIndex}
            className="h-32 rounded-lg border border-slate-200 bg-white p-5"
          >
            <div className="h-4 w-28 rounded bg-slate-200" />
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
