import { LoaderCircle, TriangleAlert } from "lucide-react";
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
      className="max-w-[530px] px-6 py-8 sm:p-10"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="exit-game-title"
      overlayClassName="bg-slate-950/35"
      zIndexClassName="z-[70]"
    >
      <div className="flex items-center gap-2.5">
        <TriangleAlert
          aria-hidden="true"
          className="h-5 w-5 shrink-0 fill-yellow-300 text-slate-950"
        />
        <h2
          id="exit-game-title"
          className="text-xl font-semibold leading-6 text-slate-950"
        >
          Exit Notice
        </h2>
      </div>
      <p className="mt-5 text-base font-medium leading-6 text-slate-500">
        Are you sure you want to end the MCQ quiz now?
      </p>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-[18px] grid gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleExit}
          disabled={isExiting}
          aria-busy={isExiting}
          className="flex h-[50px] cursor-pointer items-center justify-center rounded bg-[#008477] text-base font-medium text-white transition-colors hover:bg-[#006f65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008477] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExiting ? (
            <>
              <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
              <span className="sr-only">Ending game...</span>
            </>
          ) : (
            "Yes, Continue"
          )}
        </button>
        <button
          ref={cancelButtonRef}
          type="button"
          onClick={props.onCancel}
          disabled={isExiting}
          className="h-[50px] cursor-pointer rounded border border-[#008477] bg-white text-base font-medium text-[#008477] transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008477] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          No, Cancel
        </button>
      </div>
    </QuizModalShell>
  );
}
