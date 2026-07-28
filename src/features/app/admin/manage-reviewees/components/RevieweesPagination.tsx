import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type RevieweesPaginationProps = {
  currentPage: number;
  firstItem: number;
  lastItem: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  totalPages: number;
};

export const RevieweesPagination = ({ currentPage, firstItem, lastItem, onPageChange, totalItems, totalPages }: RevieweesPaginationProps) => {
  if (!totalItems) return null;

  return (
    <div className="mt-5 flex flex-col gap-4 text-sm text-secondary-text sm:flex-row sm:items-center sm:justify-between">
      <p>Showing {firstItem} to {lastItem} of {totalItems} users</p>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-border disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page"><ChevronLeftIcon className="h-4 w-4" /></button>
        {Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1).map((page) => (
          <button key={page} type="button" onClick={() => onPageChange(page)} aria-current={page === currentPage ? "page" : undefined} className={`h-8 min-w-8 cursor-pointer rounded px-2 ${page === currentPage ? "bg-primary-accent text-surface" : "border border-border"}`}>{page}</button>
        ))}
        <button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-border disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page"><ChevronRightIcon className="h-4 w-4" /></button>
      </div>
    </div>
  );
};
