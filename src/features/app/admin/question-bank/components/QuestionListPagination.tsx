import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

type QuestionListPaginationProps = {
  currentPage: number;
  firstQuestionNumber: number;
  lastQuestionNumber: number;
  onPageChange: (page: number) => void;
  totalQuestions: number;
  totalPages: number;
};

export default function QuestionListPagination({
  currentPage,
  firstQuestionNumber,
  lastQuestionNumber,
  onPageChange,
  totalQuestions,
  totalPages,
}: QuestionListPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex flex-col gap-4 text-sm font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing {firstQuestionNumber} to {lastQuestionNumber} of {totalQuestions}{" "}
        questions
      </p>

      <nav className="flex items-center gap-2" aria-label="Question pages">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-slate-300 bg-white text-slate-500 transition-colors hover:border-[#009688] hover:text-[#009688] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
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
                ? "bg-[#009688] text-white"
                : "border border-slate-300 bg-white text-slate-500 hover:border-[#009688] hover:text-[#009688]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded border border-slate-300 bg-white text-slate-500 transition-colors hover:border-[#009688] hover:text-[#009688] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
