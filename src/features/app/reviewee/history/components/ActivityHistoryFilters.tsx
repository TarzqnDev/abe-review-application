import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
  { label: "Flash Cards", value: "flash_cards" },
];

const statusOptions: Array<{
  label: string;
  value: ActivityStatusFilter;
}> = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Exited", value: "exited" },
  { label: "Cancelled", value: "cancelled" },
];

export default function ActivityHistoryFilters({
  activityTypeFilter,
  onActivityTypeFilterChange,
  onSearchQueryChange,
  onStatusFilterChange,
  searchQuery,
  statusFilter,
}: ActivityHistoryFiltersProps) {
  return (
    <section className="mb-6 rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-4">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-primary-text">
              Activity Type
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
                      : "border-border bg-surface text-slate-700 hover:border-primary-accent"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-primary-text">
              Session Status
            </h2>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onStatusFilterChange(option.value)}
                  className={`h-[30px] cursor-pointer rounded border px-4 text-xs font-medium transition-colors ${
                    statusFilter === option.value
                      ? "border-primary-accent bg-primary-accent text-surface"
                      : "border-border bg-surface text-slate-700 hover:border-primary-accent"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative w-full xl:w-[310px]">
          <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-300" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search area, game, or difficulty"
            aria-label="Search activity history"
            className="h-10 w-full rounded-full border border-border bg-surface pr-4 pl-10 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-300 focus:border-primary-accent"
          />
        </div>
      </div>
    </section>
  );
}
