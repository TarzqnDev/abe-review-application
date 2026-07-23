import { ClockIcon } from "@heroicons/react/24/outline";

type ActivityHistoryEmptyProps = {
  isFiltered: boolean;
};

export default function ActivityHistoryEmpty({
  isFiltered,
}: ActivityHistoryEmptyProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-surface px-6 py-14 text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-primary-accent">
        <ClockIcon className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-primary-text">
        {isFiltered ? "No matching activities" : "No activity history yet"}
      </h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-secondary-text">
        {isFiltered
          ? "Try changing your activity type, status, or search filters."
          : "Your completed, exited, and cancelled study sessions will appear here."}
      </p>
    </div>
  );
}
