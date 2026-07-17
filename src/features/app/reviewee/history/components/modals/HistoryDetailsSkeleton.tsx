export default function HistoryDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-label="Loading activity details">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 rounded bg-slate-100" />
        ))}
      </div>
      <div className="h-24 rounded bg-slate-100" />
      <div className="space-y-3">
        <div className="h-5 w-36 rounded bg-slate-100" />
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-48 rounded bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
