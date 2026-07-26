import type {
  AdminSubject,
  AdminSubjectArea,
} from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import {
  ArrowTopRightOnSquareIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export type SubjectAreaMode = "edit" | "remove" | null;

type SubjectAreaSectionProps = {
  isPredefined?: boolean;
  mode: SubjectAreaMode;
  onModeChange: (mode: SubjectAreaMode) => void;
  onSelectSubject: (subject: AdminSubject) => void;
  subjectArea: AdminSubjectArea;
};

export default function SubjectAreaSection({
  isPredefined = false,
  mode,
  onModeChange,
  onSelectSubject,
  subjectArea,
}: SubjectAreaSectionProps) {
  const activeMode = isPredefined ? null : mode;
  const subjectButtonClassName =
    activeMode === "edit"
      ? "border-border hover:border-warning"
      : activeMode === "remove"
        ? "border-border hover:border-error"
        : "border-border hover:border-primary-accent";

  return (
    <section className="mb-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-primary-text">
            {subjectArea.name}
          </h2>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-medium text-primary-accent">
            {subjectArea.subjects.length}{" "}
            {subjectArea.subjects.length === 1 ? "Subject" : "Subjects"}
          </span>
        </div>

        {!isPredefined && (
          <div className="flex items-center gap-3 text-sm text-secondary-text">
            <button
              type="button"
              onClick={() => onModeChange(mode === "edit" ? null : "edit")}
              className="flex cursor-pointer items-center gap-1 transition-colors hover:text-slate-700"
              aria-pressed={mode === "edit"}
            >
              {mode === "edit" ? (
                <>
                  <XMarkIcon className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <PencilSquareIcon className="h-4 w-4" />
                  Edit
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onModeChange(mode === "remove" ? null : "remove")}
              className="flex cursor-pointer items-center gap-1 transition-colors hover:text-slate-700"
              aria-pressed={mode === "remove"}
            >
              {mode === "remove" ? (
                <>
                  <XMarkIcon className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <TrashIcon className="h-4 w-4" />
                  Remove
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {subjectArea.subjects.length > 0 ? (
          subjectArea.subjects.map((subject) => (
            <button
              key={subject.id}
              type="button"
              onClick={() => onSelectSubject(subject)}
              className={`group flex min-h-12 w-full cursor-pointer items-center justify-between rounded border bg-surface px-5 text-left text-base font-medium text-primary-text transition-colors ${
                isPredefined
                  ? "border-border hover:border-primary-accent"
                  : subjectButtonClassName
              }`}
              aria-label={`${activeMode === "edit" ? "Edit" : activeMode === "remove" ? "Remove" : "Open"} ${subject.name}`}
            >
              <span>{subject.name}</span>
              {activeMode === "edit" ? (
                <PencilSquareIcon className="h-5 w-5 text-secondary-text transition-colors group-hover:text-warning" />
              ) : activeMode === "remove" ? (
                <TrashIcon className="h-5 w-5 text-secondary-text transition-colors group-hover:text-error" />
              ) : (
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-secondary-text transition-colors group-hover:text-primary-accent" />
              )}
            </button>
          ))
        ) : (
          <div className="rounded border border-border bg-surface px-5 py-4 text-sm text-secondary-text">
            No subjects yet.
          </div>
        )}
      </div>
    </section>
  );
}
