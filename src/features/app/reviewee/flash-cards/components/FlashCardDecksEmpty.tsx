import { RectangleStackIcon } from "@heroicons/react/24/outline";

export default function FlashCardDecksEmpty() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <RectangleStackIcon className="mx-auto h-10 w-10 text-slate-300" />
      <h2 className="mt-3 text-base font-semibold text-slate-800">
        No flash card areas available
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Flash card areas will appear here once they are available.
      </p>
    </div>
  );
}
