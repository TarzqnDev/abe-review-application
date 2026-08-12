const MAX_VISIBLE_PAGE_BUTTONS = 5;

export function getPaginationPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisiblePageButtons = MAX_VISIBLE_PAGE_BUTTONS,
) {
  const normalizedTotalPages = Math.max(0, Math.floor(totalPages));

  if (!normalizedTotalPages) return [];

  const visiblePageCount = Math.min(
    Math.max(1, Math.floor(maxVisiblePageButtons)),
    normalizedTotalPages,
  );
  const safeCurrentPage = Math.min(
    Math.max(1, Math.floor(currentPage)),
    normalizedTotalPages,
  );
  const firstPage = Math.min(
    Math.max(1, safeCurrentPage - Math.floor(visiblePageCount / 2)),
    normalizedTotalPages - visiblePageCount + 1,
  );

  return Array.from(
    { length: visiblePageCount },
    (_, pageOffset) => firstPage + pageOffset,
  );
}
