import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

type FlashCardListPaginationProps = {
  currentPage: number;
  firstFlashCardNumber: number;
  lastFlashCardNumber: number;
  onPageChange: (page: number) => void;
  totalFlashCards: number;
  totalPages: number;
};

export default function FlashCardListPagination({
  currentPage,
  firstFlashCardNumber,
  lastFlashCardNumber,
  onPageChange,
  totalFlashCards,
  totalPages,
}: FlashCardListPaginationProps) {
  if (!totalFlashCards) return null;

  return (
    <div className="mt-6 flex flex-col gap-4 text-sm font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing {firstFlashCardNumber} to {lastFlashCardNumber} of{" "}
        {totalFlashCards} flash cards
      </p>

      <nav className="flex items-center gap-2" aria-label="Flash card pages">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-slate-300 bg-white text-slate-500 transition-colors hover:border-teal-600 hover:text-teal-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {Array.from(
          { length: totalPages },
          (_, pageIndex) => pageIndex + 1,
        ).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`h-9 min-w-9 cursor-pointer rounded px-2 text-sm font-semibold transition-colors ${
              page === currentPage
                ? "bg-teal-600 text-white"
                : "border border-slate-300 bg-white text-slate-500 hover:border-teal-600 hover:text-teal-600"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-slate-300 bg-white text-slate-500 transition-colors hover:border-teal-600 hover:text-teal-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
