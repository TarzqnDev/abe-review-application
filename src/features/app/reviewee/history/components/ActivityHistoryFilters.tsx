import { useEffect, useRef, useState } from "react";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type {
  ActivityStatusFilter,
  ActivityTypeFilter,
} from "@/features/app/reviewee/history/hooks/useRevieweeHistory";

type ActivityHistoryFiltersProps = {
  activityTypeFilter: ActivityTypeFilter;
  onActivityTypeFilterChange: (filter: ActivityTypeFilter) => void;
  onSearchQueryChange: (query: string) => void;
  onStatusFilterChange: (filter: ActivityStatusFilter) => void;
  searchQuery: string;
  statusFilter: ActivityStatusFilter;
};

const activityTypeOptions: Array<{
  label: string;
  value: ActivityTypeFilter;
}> = [
  { label: "All Activities", value: "all" },
  { label: "MCQ Quiz", value: "mcq_quiz" },
  { label: "Flash Card", value: "flash_cards" },
];

const statusOptions: Array<{
  label: string;
  value: ActivityStatusFilter;
}> = [
  { label: "All Statuses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Exited", value: "exited" },
];

export default function ActivityHistoryFilters({
  activityTypeFilter,
  onActivityTypeFilterChange,
  onSearchQueryChange,
  onStatusFilterChange,
  searchQuery,
  statusFilter,
}: ActivityHistoryFiltersProps) {
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isStatusFilterOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        statusFilterRef.current &&
        !statusFilterRef.current.contains(event.target as Node)
      ) {
        setIsStatusFilterOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isStatusFilterOpen]);

  return (
    <section className="mb-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="mb-3 text-base font-semibold text-primary-text">
            Filter by Game Activity
          </h2>
          <div className="flex flex-wrap gap-2">
            {activityTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onActivityTypeFilterChange(option.value)}
                className={`h-[30px] cursor-pointer rounded border px-4 text-xs font-medium transition-colors ${
                  activityTypeFilter === option.value
                    ? "border-primary-accent bg-primary-accent text-surface"
                    : "border-border bg-surface text-primary-text hover:border-primary-accent"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full items-center gap-2 xl:w-auto">
          <div ref={statusFilterRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() =>
                setIsStatusFilterOpen(
                  (currentIsStatusFilterOpen) => !currentIsStatusFilterOpen,
                )
              }
              aria-expanded={isStatusFilterOpen}
              aria-label="Filter session status"
              className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${
                statusFilter === "all"
                  ? "border-border text-secondary-text hover:border-primary-accent hover:text-primary-accent"
                  : "border-primary-accent text-primary-accent"
              }`}
            >
              <FunnelIcon className="h-4 w-4" />
            </button>

            {isStatusFilterOpen && (
              <div className="absolute top-10 left-0 z-20 w-48 rounded border border-border bg-surface p-3 shadow-lg">
                <p className="mb-2 text-xs font-semibold text-primary-text">
                  Session Status
                </p>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-2 text-sm text-secondary-text"
                    >
                      <input
                        type="radio"
                        name="activity-history-status"
                        value={option.value}
                        checked={statusFilter === option.value}
                        onChange={() => {
                          onStatusFilterChange(option.value);
                          setIsStatusFilterOpen(false);
                        }}
                        className="h-4 w-4 accent-primary-accent"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative w-full xl:w-[275px]">
            <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search recent activity"
              aria-label="Search activity history"
              className="h-8 w-full rounded-full border border-border bg-surface pr-4 pl-9 text-xs text-slate-700 outline-none transition-colors placeholder:text-slate-300 focus:border-primary-accent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
