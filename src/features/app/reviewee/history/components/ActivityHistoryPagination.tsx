import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type ActivityHistoryPaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export default function ActivityHistoryPagination({
  currentPage,
  onPageChange,
  pageSize,
  totalItems,
  totalPages,
}: ActivityHistoryPaginationProps) {
  if (totalPages <= 1) return null;

  const visibleItems =
    currentPage === totalPages
      ? totalItems - (currentPage - 1) * pageSize
      : pageSize;

  return (
    <nav
      aria-label="Activity history pagination"
      className="mt-3 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm font-medium text-secondary-text">
        Showing {visibleItems.toLocaleString()} of {totalItems.toLocaleString()}{" "}
        activities
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-border bg-surface text-slate-600 transition-colors hover:border-primary-accent hover:text-primary-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded bg-primary-accent px-3 text-xs font-medium text-surface">
          {currentPage}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-border bg-surface text-slate-600 transition-colors hover:border-primary-accent hover:text-primary-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
