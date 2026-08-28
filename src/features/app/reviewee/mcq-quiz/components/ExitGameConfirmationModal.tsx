import { LoaderCircle } from "lucide-react";
import Image from "next/image";
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
  const exitGameConfirmationModal = useExitGameConfirmationModal(props);

  return (
    <QuizModalShell
      className="max-w-[530px] px-6 py-8 sm:p-10"
      dialogRef={exitGameConfirmationModal.modalAccessibility.dialogRef}
      isOpen={props.isOpen}
      isVisible={exitGameConfirmationModal.modalAccessibility.isVisible}
      labelledBy="exit-game-title"
      overlayClassName="bg-slate-950/35"
      zIndexClassName="z-[70]"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center">
          <Image
            src="/caution.png"
            alt=""
            width={26}
            height={26}
            className="h-8 w-8 object-cover"
          />
        </div>
        <h2
          id="exit-game-title"
          className="text-xl font-semibold leading-6 text-primary-text"
        >
          Exit Notice
        </h2>
      </div>
      <p className="mt-5 text-base font-medium leading-6 text-secondary-text">
        Are you sure you want to end the MCQ quiz now?
      </p>

      {exitGameConfirmationModal.error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {exitGameConfirmationModal.error}
        </p>
      )}

      <div className="mt-[18px] grid gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={exitGameConfirmationModal.handleExit}
          disabled={exitGameConfirmationModal.isExiting}
          aria-busy={exitGameConfirmationModal.isExiting}
          className="flex h-[50px] cursor-pointer items-center justify-center rounded bg-primary-accent text-base font-medium text-surface transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {exitGameConfirmationModal.isExiting ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="h-5 w-5 animate-spin"
              />
              <span className="sr-only">Ending game...</span>
            </>
          ) : (
            "Yes, Continue"
          )}
        </button>
        <button
          ref={exitGameConfirmationModal.cancelButtonRef}
          type="button"
          onClick={props.onCancel}
          disabled={exitGameConfirmationModal.isExiting}
          className="h-[50px] cursor-pointer rounded border border-primary-accent bg-surface text-base font-medium text-primary-accent transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          No, Cancel
        </button>
      </div>
    </QuizModalShell>
  );
}
