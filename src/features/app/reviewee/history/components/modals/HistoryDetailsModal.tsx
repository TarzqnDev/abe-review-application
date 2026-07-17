import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import FlashCardHistoryDetailsItem from "@/features/app/reviewee/history/components/modals/FlashCardHistoryDetailsItem";
import HistoryDetailsSkeleton from "@/features/app/reviewee/history/components/modals/HistoryDetailsSkeleton";
import HistoryDetailsSummary from "@/features/app/reviewee/history/components/modals/HistoryDetailsSummary";
import McqHistoryDetailsItem from "@/features/app/reviewee/history/components/modals/McqHistoryDetailsItem";
import { useHistoryDetailsModal } from "@/features/app/reviewee/history/hooks/modals/useHistoryDetailsModal";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";

export type HistoryDetailsModalProps = {
  historyId: number | null;
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
  cancelled: "Cancelled",
  completed: "Completed",
  exited: "Ended Early",
} as const;

export default function HistoryDetailsModal(props: HistoryDetailsModalProps) {
  const {
    closeButtonRef,
    details,
    error,
    handleClose,
    isLoading,
    loadDetails,
    modalAccessibility,
  } = useHistoryDetailsModal(props);
  const { dialogRef, handleBackdropMouseDown, isVisible } = modalAccessibility;
  const history = details?.history ?? null;

  if (!props.isOpen && !isVisible) return null;

  return (
    <QuizModalShell
      className="flex max-h-[calc(100vh-2rem)] max-w-[1050px] flex-col overflow-hidden sm:max-h-[calc(100vh-3rem)]"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="history-details-title"
      onBackdropMouseDown={handleBackdropMouseDown}
    >
      <header className="shrink-0 border-b border-slate-200 px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="history-details-title" className="text-xl font-semibold text-slate-950">
                Activity Details
              </h2>
              {history && (
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    history.status === "completed"
                      ? "bg-teal-50 text-teal-700"
                      : history.status === "exited"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {statusLabel[history.status]}
                </span>
              )}
            </div>
            {history && (
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
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
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close activity details"
            className="shrink-0 cursor-pointer rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
        {isLoading ? (
          <HistoryDetailsSkeleton />
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded border border-red-200 bg-red-50 px-5 py-10 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void loadDetails()}
              className="mt-4 flex cursor-pointer items-center gap-2 rounded border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : details && history ? (
          <>
            <HistoryDetailsSummary history={history} />

            <section className="mt-7" aria-labelledby="activity-items-title">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 id="activity-items-title" className="text-base font-semibold text-slate-950">
                    {history.sessionType === "flash_cards" ? "Flash Cards" : "Questions"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {details.items.length} {details.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              {details.items.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {details.items.map((item) =>
                    item.sessionType === "mcq_quiz" ? (
                      <McqHistoryDetailsItem key={`${item.sessionType}-${item.id}`} item={item} />
                    ) : (
                      <FlashCardHistoryDetailsItem key={`${item.sessionType}-${item.id}`} item={item} />
                    ),
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded border border-slate-200 bg-slate-50 px-5 py-10 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    {history.status === "cancelled"
                      ? "This activity was cancelled before the game started."
                      : "No activity items were recorded for this session."}
                  </p>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </QuizModalShell>
  );
}
