import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ActivityHistoryPagination from "@/features/app/reviewee/history/components/ActivityHistoryPagination";
import FlashCardHistoryDetailsItem from "@/features/app/reviewee/history/components/modals/FlashCardHistoryDetailsItem";
import HistoryDetailsSkeleton from "@/features/app/reviewee/history/components/modals/HistoryDetailsSkeleton";
import HistoryDetailsSummary from "@/features/app/reviewee/history/components/modals/HistoryDetailsSummary";
import McqHistoryDetailsItem from "@/features/app/reviewee/history/components/modals/McqHistoryDetailsItem";
import { useHistoryDetailsModal } from "@/features/app/reviewee/history/hooks/modals/useHistoryDetailsModal";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";

export type HistoryDetailsModalProps = {
  sessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

const activityDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const statusLabel = {
  completed: "Completed",
  exited: "Ended Early",
} as const;

export default function HistoryDetailsModal(props: HistoryDetailsModalProps) {
  const historyDetailsModal = useHistoryDetailsModal(props);
  const history = historyDetailsModal.details?.history ?? null;

  if (!props.isOpen && !historyDetailsModal.modalAccessibility.isVisible) return null;

  return (
    <QuizModalShell
      className="flex max-h-[calc(100dvh-2rem)] max-w-[980px] flex-col overflow-hidden sm:max-h-[calc(100vh-3rem)]"
      dialogRef={historyDetailsModal.modalAccessibility.dialogRef}
      isOpen={props.isOpen}
      isVisible={historyDetailsModal.modalAccessibility.isVisible}
      labelledBy="history-details-title"
      onBackdropMouseDown={historyDetailsModal.modalAccessibility.handleBackdropMouseDown}
      overlayClassName="bg-slate-950/45"
    >
      <header className="shrink-0 border-b border-border bg-secondary-bg px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="history-details-title" className="text-xl font-semibold text-primary-text">
                {history
                  ? history.sessionType === "mcq_quiz"
                    ? "MCQ Quiz Game"
                    : "Flash Card Game"
                  : "Activity Details"}
              </h2>
              {history && (
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    history.status === "completed"
                      ? "bg-teal-50 text-primary-dark"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {statusLabel[history.status]}
                </span>
              )}
            </div>
            {history && (
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-secondary-text">
                <span className="font-medium text-slate-700">{history.areaName}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {history.sessionType === "mcq_quiz" ? "MCQ Quiz" : "Flash Cards"}
                </span>
                {history.sessionType === "mcq_quiz" && (
                  <span aria-hidden="true">·</span>
                )}
                {history.sessionType === "mcq_quiz" && (
                <span>{history.gameType}</span>
                )}
                {history.difficulty && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{history.difficulty}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{activityDateTimeFormatter.format(new Date(history.terminalAt))}</span>
              </div>
            )}
          </div>
          <button
            ref={historyDetailsModal.closeButtonRef}
            type="button"
            onClick={historyDetailsModal.handleClose}
            aria-label="Close activity details"
            className="shrink-0 cursor-pointer rounded p-1 text-secondary-text transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
        {historyDetailsModal.isLoading ? (
          <HistoryDetailsSkeleton />
        ) : historyDetailsModal.error ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded border border-red-200 bg-red-50 px-5 py-10 text-center">
            <p className="text-sm font-medium text-red-700">{historyDetailsModal.error}</p>
            <button
              type="button"
              onClick={() => void historyDetailsModal.loadDetails()}
              className="mt-4 flex cursor-pointer items-center gap-2 rounded border border-red-300 bg-surface px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : historyDetailsModal.details && history ? (
          <>
            <HistoryDetailsSummary history={history} {...historyDetailsModal.summaryPresentation} />

            <section className="mt-7" aria-labelledby="activity-items-title">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 id="activity-items-title" className="text-base font-semibold text-primary-text">
                    {history.sessionType === "flash_cards" ? "Flash Cards" : "Questions"}
                  </h3>
                  <p className="mt-1 text-sm text-secondary-text">
                  {historyDetailsModal.details.items.length} {historyDetailsModal.details.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              {historyDetailsModal.details.items.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {historyDetailsModal.paginatedItems.map((item) =>
                    item.sessionType === "mcq_quiz" ? (
                      <McqHistoryDetailsItem key={`${item.sessionType}-${item.id}`} item={item} />
                    ) : (
                      <FlashCardHistoryDetailsItem key={`${item.sessionType}-${item.id}`} item={item} />
                    ),
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded border border-border bg-secondary-bg px-5 py-10 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    No activity items were recorded for this session.
                  </p>
                </div>
              )}

              <ActivityHistoryPagination
                currentPage={historyDetailsModal.activeItemPage}
                itemLabel={history.sessionType === "flash_cards" ? "flash cards" : "questions"}
                onPageChange={historyDetailsModal.setCurrentPage}
                pageSize={historyDetailsModal.itemPageSize}
                totalItems={historyDetailsModal.details.items.length}
                totalPages={historyDetailsModal.totalItemPages}
              />
            </section>
          </>
        ) : null}
      </div>
    </QuizModalShell>
  );
}
