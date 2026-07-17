import { ClockIcon } from "@heroicons/react/24/outline";

type ActivityHistoryEmptyProps = {
  isFiltered: boolean;
};

export default function ActivityHistoryEmpty({
  isFiltered,
}: ActivityHistoryEmptyProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
        <ClockIcon className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-slate-900">
        {isFiltered ? "No matching activities" : "No activity history yet"}
      </h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {isFiltered
          ? "Try changing your activity type, status, or search filters."
          : "Your completed, exited, and cancelled study sessions will appear here."}
      </p>
    </div>
  );
}
