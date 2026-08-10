import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useFlashCardExitGameConfirmationModal } from "@/features/app/reviewee/flash-cards/hooks/modals/game/useFlashCardExitGameConfirmationModal";
import type { FlashCardSummary } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";

export type FlashCardExitGameConfirmationModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onExited: (summary: FlashCardSummary) => void;
  sessionId: string;
};

export default function FlashCardExitGameConfirmationModal(
  props: FlashCardExitGameConfirmationModalProps,
) {
  const { cancelButtonRef, error, handleExit, isExiting, modalAccessibility } =
    useFlashCardExitGameConfirmationModal(props);
  const { dialogRef, isVisible } = modalAccessibility;

  return (
    <QuizModalShell
      className="max-w-[530px] px-6 py-8 sm:p-10"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="exit-flash-card-game-title"
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
          id="exit-flash-card-game-title"
          className="text-xl font-semibold leading-6 text-primary-text"
        >
          Exit Notice
        </h2>
      </div>
      <p className="mt-5 text-base font-medium leading-6 text-secondary-text">
        Are you sure you want to end the flash card game now?
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
          className="flex h-[50px] cursor-pointer items-center justify-center rounded bg-primary-accent text-base font-medium text-surface transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExiting ? (
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
          ref={cancelButtonRef}
          type="button"
          onClick={props.onCancel}
          disabled={isExiting}
          className="h-[50px] cursor-pointer rounded border border-primary-accent bg-surface text-base font-medium text-primary-accent transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          No, Cancel
        </button>
      </div>
    </QuizModalShell>
  );
}
