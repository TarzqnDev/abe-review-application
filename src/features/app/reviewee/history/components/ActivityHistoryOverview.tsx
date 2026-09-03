import Image from "next/image";

type ActivityHistoryOverviewProps = {
  averageAccuracy: number;
  reviewStreakDays: number;
  totalSessions: number;
  totalStudySeconds: number;
};

const formatStudyTime = (totalSeconds: number) => {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

const formatReviewStreak = (reviewStreakDays: number) => {
  if (reviewStreakDays >= 28) {
    const reviewStreakMonths = Math.floor(reviewStreakDays / 28);
    return `${reviewStreakMonths.toLocaleString()} ${reviewStreakMonths === 1 ? "Month" : "Months"}`;
  }

  if (reviewStreakDays >= 7) {
    const reviewStreakWeeks = Math.floor(reviewStreakDays / 7);
    return `${reviewStreakWeeks.toLocaleString()} ${reviewStreakWeeks === 1 ? "Week" : "Weeks"}`;
  }

  return `${reviewStreakDays.toLocaleString()} ${reviewStreakDays === 1 ? "Day" : "Days"}`;
};

export default function ActivityHistoryOverview({
  averageAccuracy,
  reviewStreakDays,
  totalSessions,
  totalStudySeconds,
}: ActivityHistoryOverviewProps) {
  const overviewItems = [
    {
      iconSrc: "/history-session.png",
      label: "Total Sessions",
      value: totalSessions.toLocaleString(),
    },
    {
      iconSrc: "/history-accuracy.png",
      label: "Average Accuracy",
      value: `${averageAccuracy}%`,
    },
    {
      iconSrc: "/history-time.png",
      label: "Total Review Time",
      value: formatStudyTime(totalStudySeconds),
    },
    {
      iconSrc:
        reviewStreakDays === 0
          ? "/history-streak-empty.png"
          : "/history-streak.png",
      label: "Review Streak",
      value: formatReviewStreak(reviewStreakDays),
    },
  ];

  return (
    <section
      aria-label="Activity overview"
      className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {overviewItems.map((overviewItem) => (
        <article
          key={overviewItem.label}
          className="rounded border border-border bg-surface px-5 py-4 text-center"
        >
          <Image
            src={overviewItem.iconSrc}
            alt=""
            width={28}
            height={28}
            className="mx-auto h-7 w-7 object-contain"
          />
          <p className="mt-2 text-xl font-semibold leading-tight text-secondary-text">
            {overviewItem.value}
          </p>
          <p className="mt-1 text-sm font-medium text-secondary-text">
            {overviewItem.label}
          </p>
        </article>
      ))}
    </section>
  );
}
