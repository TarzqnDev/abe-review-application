import {
  AcademicCapIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

type ActivityHistoryOverviewProps = {
  averageAccuracy: number;
  completedSessions: number;
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

export default function ActivityHistoryOverview({
  averageAccuracy,
  completedSessions,
  totalSessions,
  totalStudySeconds,
}: ActivityHistoryOverviewProps) {
  const overviewItems = [
    {
      icon: AcademicCapIcon,
      label: "Total Sessions",
      value: totalSessions.toLocaleString(),
    },
    {
      icon: ChartBarIcon,
      label: "Average Accuracy",
      value: `${averageAccuracy}%`,
    },
    {
      icon: CheckCircleIcon,
      label: "Completed",
      value: completedSessions.toLocaleString(),
    },
    {
      icon: ClockIcon,
      label: "Total Study Time",
      value: formatStudyTime(totalStudySeconds),
    },
  ];

  return (
    <section
      aria-label="Activity overview"
      className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {overviewItems.map((overviewItem) => {
        const Icon = overviewItem.icon;

        return (
          <article
            key={overviewItem.label}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {overviewItem.label}
                </p>
                <p className="mt-0.5 text-xl font-semibold text-slate-950">
                  {overviewItem.value}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
