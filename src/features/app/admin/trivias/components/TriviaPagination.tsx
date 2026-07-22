import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type TriviaPaginationProps = {
  currentPage: number;
  firstTriviaNumber: number;
  lastTriviaNumber: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalTrivias: number;
};

export default function TriviaPagination({
  currentPage,
  firstTriviaNumber,
  lastTriviaNumber,
  onPageChange,
  totalPages,
  totalTrivias,
}: TriviaPaginationProps) {
  return (
    <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {firstTriviaNumber} to {lastTriviaNumber} of {totalTrivias}{" "}
        {totalTrivias === 1 ? "trivia" : "trivias"}
      </p>

      {totalPages > 1 && (
        <nav className="flex items-center gap-1.5" aria-label="Trivia pagination">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:border-teal-600 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-current={pageNumber === currentPage ? "page" : undefined}
                className={`flex h-8 min-w-8 cursor-pointer items-center justify-center rounded px-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
                  pageNumber === currentPage
                    ? "bg-teal-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-teal-600 hover:text-teal-600"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:border-teal-600 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Next page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
