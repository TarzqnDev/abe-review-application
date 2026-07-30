import Image from "next/image";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";
import { useNoQuestionsModal } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useNoQuestionsModal";

export type NoQuestionsModalProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

export default function NoQuestionsModal(props: NoQuestionsModalProps) {
  const { closeButtonRef, modalAccessibility } =
    useNoQuestionsModal(props);
  const {
    dialogRef,
    handleBackdropMouseDown,
    isVisible,
  } = modalAccessibility;

  return (
    <QuizModalShell
      className="max-w-[530px] px-6 py-9 sm:px-10 sm:py-10"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="no-questions-title"
      onBackdropMouseDown={handleBackdropMouseDown}
      overlayClassName="bg-slate-950/30"
      zIndexClassName="z-[70]"
    >
      <div>
        <h2
          id="no-questions-title"
          className="flex items-center gap-2 text-xl font-semibold text-primary-text"
        >
          <Image
            src="/notify.png"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 object-contain"
          />
          No Questions Available
        </h2>
        <p className="mt-5 text-base leading-6 text-secondary-text">
          {props.message}
        </p>
        <button
          ref={closeButtonRef}
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
