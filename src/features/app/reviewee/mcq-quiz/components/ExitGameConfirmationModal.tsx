import { LoaderCircle } from "lucide-react";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";
import { useExitGameConfirmationModal } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useExitGameConfirmationModal";
import type { QuizSummary } from "@/features/app/reviewee/mcq-quiz/types/quiz";

export type ExitGameConfirmationModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onExited: (summary: QuizSummary) => void;
  sessionId: string;
};

export default function ExitGameConfirmationModal(
  props: ExitGameConfirmationModalProps,
) {
  const {
    cancelButtonRef,
    error,
    handleExit,
    isExiting,
    modalAccessibility,
  } = useExitGameConfirmationModal(props);
  const { dialogRef, isVisible } = modalAccessibility;

  return (
    <QuizModalShell
      className="max-w-[460px] p-7 sm:px-9 sm:py-8"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="exit-game-title"
      overlayClassName="bg-slate-950/35"
      zIndexClassName="z-[70]"
    >
      <h2
        id="exit-game-title"
        className="text-xl font-semibold text-slate-900"
      >
        Notice
      </h2>
      <p className="mt-6 text-base leading-6 text-slate-500">
        Are you sure you want to end the quiz now?
      </p>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleExit}
          disabled={isExiting}
          className="flex h-11 cursor-pointer items-center justify-center rounded bg-teal-600 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExiting ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            "Yes"
          )}
        </button>
        <button
          ref={cancelButtonRef}
          type="button"
          onClick={props.onCancel}
          disabled={isExiting}
          className="h-11 cursor-pointer rounded border border-teal-600 bg-white text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </QuizModalShell>
  );
}
