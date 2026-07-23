import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
      className="max-w-[430px] p-7 sm:p-8"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="no-questions-title"
      onBackdropMouseDown={handleBackdropMouseDown}
      overlayClassName="bg-slate-950/30"
      zIndexClassName="z-[70]"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={props.onClose}
        className="absolute top-5 right-5 cursor-pointer rounded text-secondary-text transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        aria-label="Close no questions notice"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>

      <div className="pr-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
          <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
        </div>
        <h2
          id="no-questions-title"
          className="text-xl font-semibold text-primary-text"
        >
          No Questions Available
        </h2>
        <p className="mt-3 text-sm leading-6 text-secondary-text">{props.message}</p>
      </div>
    </QuizModalShell>
  );
}
