import type { AdminSubjectArea } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import type { SubjectAreaFilter } from "@/features/app/admin/question-bank/hooks/useQuestionBank";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type SubjectFiltersProps = {
  activeAreaFilter: SubjectAreaFilter;
  onAreaFilterChange: (areaFilter: SubjectAreaFilter) => void;
  onSearchQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
  subjectAreas: AdminSubjectArea[];
};

export default function SubjectFilters({
  activeAreaFilter,
  onAreaFilterChange,
  onSearchQueryChange,
  searchQuery,
  subjectAreas,
}: SubjectFiltersProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mb-4 text-base font-semibold text-slate-950">
            Filter by Area
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onAreaFilterChange("all")}
              className={`h-[30px] min-w-25 cursor-pointer rounded border px-5 text-xs font-medium transition-colors ${
                activeAreaFilter === "all"
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-200 bg-white text-slate-950 hover:border-teal-600"
              }`}
            >
              All Areas
            </button>
            {subjectAreas.map((subjectArea) => (
              <button
                key={subjectArea.id}
                type="button"
                onClick={() => onAreaFilterChange(subjectArea.id)}
                className={`h-[30px] min-w-20 cursor-pointer rounded border px-5 text-xs font-medium transition-colors ${
                  activeAreaFilter === subjectArea.id
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-200 bg-white text-slate-950 hover:border-teal-600"
                }`}
              >
                {subjectArea.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-[275px]">
          <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-300" />
          <input
            type="search"
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search a subject"
            className="h-[30px] w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-700 outline-none transition-colors placeholder:text-slate-300 focus:border-teal-600"
          />
        </div>
      </div>
    </div>
  );
}
