export default function HistoryDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-7" aria-label="Loading activity details">
      <div className="grid gap-6 md:grid-cols-[minmax(260px,2fr)_minmax(0,3fr)] md:items-center md:gap-10">
        <div className="text-center">
          <div className="mx-auto h-5 w-44 rounded bg-slate-100" />
          <div className="mx-auto mt-5 h-28 w-28 rounded-full bg-slate-100" />
          <div className="mx-auto mt-3 h-4 w-32 rounded bg-slate-100" />
        </div>
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-2.5">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-[100px] rounded bg-slate-100" />
            ))}
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[75px] rounded bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-5 w-36 rounded bg-slate-100" />
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-48 rounded bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
