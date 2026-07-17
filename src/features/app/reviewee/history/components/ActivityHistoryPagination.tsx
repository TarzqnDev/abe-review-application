import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type ActivityHistoryPaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  totalPages: number;
};

export default function ActivityHistoryPagination({
  currentPage,
  onPageChange,
  totalItems,
  totalPages,
}: ActivityHistoryPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Activity history pagination"
      className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-xs text-slate-500">
        {totalItems.toLocaleString()} activities · Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-slate-200 bg-white text-slate-600 transition-colors hover:border-teal-600 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded bg-teal-600 px-3 text-xs font-medium text-white">
          {currentPage}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-slate-200 bg-white text-slate-600 transition-colors hover:border-teal-600 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
