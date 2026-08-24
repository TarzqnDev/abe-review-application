import type { ActivityHistoryEntry } from "@/features/app/reviewee/history/types/activityHistory";

type HistoryDetailsSummaryProps = {
  donutBackground: string;
  duration: string;
  gameProgress: number;
  history: ActivityHistoryEntry;
  performanceMessage: string;
  scorePercentage: number;
};

export default function HistoryDetailsSummary({
  donutBackground,
  duration,
  gameProgress,
  history,
  performanceMessage,
  scorePercentage,
}: HistoryDetailsSummaryProps) {
  return (
    <section aria-labelledby="history-summary-title">
      <h3 id="history-summary-title" className="sr-only">
        Game Summary
      </h3>
      <div className="grid gap-6 md:grid-cols-[minmax(260px,2fr)_minmax(0,3fr)] md:items-center md:gap-10">
        <div className="text-center">
          <p className="text-base font-medium text-primary-text">
            Your score percentage was:
          </p>

          <div
            aria-label={`${scorePercentage}% correct across ${gameProgress} played items. ${history.correct} correct, ${history.incorrect} wrong, and ${history.timedOut} timed out.`}
            className="mx-auto mt-5 flex h-28 w-28 items-center justify-center rounded-full"
            role="img"
            style={{ background: donutBackground }}
          >
            <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-surface">
              <span className="text-xl font-semibold leading-5 text-primary-text">
                {scorePercentage}%
              </span>
              <span className="text-xs text-secondary-text">Correct</span>
            </div>
          </div>

          <p className="mt-3 text-sm font-medium text-primary-accent">
            {performanceMessage}
          </p>
        </div>

        <div className="min-w-0">
          <dl className="grid grid-cols-2 gap-2.5">
            <div className="flex min-h-[100px] flex-col items-center justify-center rounded border border-border bg-secondary-bg px-2 text-center">
              <dt className="order-2 mt-1 text-[13px] text-secondary-text">
                Game Progress
              </dt>
              <dd className="order-1 text-xl font-semibold text-secondary-text">
                {gameProgress}/{history.totalQuestions}
              </dd>
            </div>
            <div className="flex min-h-[100px] flex-col items-center justify-center rounded border border-border bg-secondary-bg px-2 text-center">
              <dt className="order-2 mt-1 text-[13px] text-secondary-text">
                Game Duration
              </dt>
              <dd className="order-1 text-xl font-semibold text-secondary-text">
                {duration}
              </dd>
            </div>
          </dl>

          <dl className="mt-2.5 grid grid-cols-3 gap-2.5">
            <div className="flex min-h-[75px] flex-col items-center justify-center rounded border border-primary-accent bg-teal-50 px-1 text-center">
              <dt className="order-2 mt-0.5 text-[13px] text-primary-accent">
                Correct
              </dt>
              <dd className="order-1 text-base font-medium text-primary-accent">
                {history.correct}
              </dd>
            </div>
            <div className="flex min-h-[75px] flex-col items-center justify-center rounded border border-error bg-red-50 px-1 text-center">
              <dt className="order-2 mt-0.5 text-[13px] text-error">Wrong</dt>
              <dd className="order-1 text-base font-medium text-error">
                {history.incorrect}
              </dd>
            </div>
            <div className="flex min-h-[75px] flex-col items-center justify-center rounded border border-warning bg-amber-50 px-1 text-center">
              <dt className="order-2 mt-0.5 text-[13px] text-warning">
                Timed Out
              </dt>
              <dd className="order-1 text-base font-medium text-warning">
                {history.timedOut}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
