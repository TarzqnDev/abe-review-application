import Image from "next/image";
import { useNoFlashCardsModal } from "@/features/app/reviewee/flash-cards/hooks/modals/game/useNoFlashCardsModal";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";

export type NoFlashCardsModalProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

export default function NoFlashCardsModal(props: NoFlashCardsModalProps) {
  const noFlashCardsModal = useNoFlashCardsModal(props);

  return (
    <QuizModalShell
      className="max-w-[530px] px-6 py-9 sm:px-10 sm:py-10"
      dialogRef={noFlashCardsModal.modalAccessibility.dialogRef}
      isOpen={props.isOpen}
      isVisible={noFlashCardsModal.modalAccessibility.isVisible}
      labelledBy="no-flash-cards-title"
      onBackdropMouseDown={
        noFlashCardsModal.modalAccessibility.handleBackdropMouseDown
      }
      overlayClassName="bg-slate-950/30"
      zIndexClassName="z-[70]"
    >
      <div>
        <h2
          id="no-flash-cards-title"
          className="flex items-center gap-2 text-xl font-semibold text-primary-text"
        >
          <Image
            src="/notify.png"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 object-contain"
          />
          No Flash Cards Available
        </h2>
        <p className="mt-5 text-base leading-6 text-secondary-text">
          {props.message}
        </p>
        <button
          ref={noFlashCardsModal.closeButtonRef}
          type="button"
          onClick={props.onClose}
          className="mt-5 h-12 w-full cursor-pointer rounded bg-primary-accent text-base font-semibold text-surface transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
        >
          Try Another Game
        </button>
      </div>
    </QuizModalShell>
  );
}
