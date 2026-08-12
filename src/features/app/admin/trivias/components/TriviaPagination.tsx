import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getPaginationPageNumbers } from "@/utils/getPaginationPageNumbers";

type TriviaPaginationProps = {
  currentPage: number;
  firstDateNumber: number;
  lastDateNumber: number;
  onPageChange: (page: number) => void;
  totalDates: number;
  totalPages: number;
};

export default function TriviaPagination({
  currentPage,
  firstDateNumber,
  lastDateNumber,
  onPageChange,
  totalDates,
  totalPages,
}: TriviaPaginationProps) {
  const pageNumbers = getPaginationPageNumbers(currentPage, totalPages);

  return (
    <div className="mt-5 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-secondary-text" aria-live="polite">
        Showing {firstDateNumber} to {lastDateNumber} of {totalDates}{" "}
        {totalDates === 1 ? "date" : "dates"}
      </p>

      {totalPages > 1 && (
        <nav className="flex items-center gap-1.5" aria-label="Trivia pagination">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-border text-secondary-text transition-colors hover:border-primary-accent hover:text-primary-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === currentPage ? "page" : undefined}
              className={`flex h-8 min-w-8 cursor-pointer items-center justify-center rounded px-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent ${
                pageNumber === currentPage
                  ? "bg-primary-accent text-surface"
                  : "border border-border bg-surface text-slate-600 hover:border-primary-accent hover:text-primary-accent"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-border text-secondary-text transition-colors hover:border-primary-accent hover:text-primary-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Next page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
