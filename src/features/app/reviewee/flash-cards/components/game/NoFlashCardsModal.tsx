import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNoFlashCardsModal } from "@/features/app/reviewee/flash-cards/hooks/modals/game/useNoFlashCardsModal";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";

export type NoFlashCardsModalProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

export default function NoFlashCardsModal(props: NoFlashCardsModalProps) {
  const { closeButtonRef, modalAccessibility } =
    useNoFlashCardsModal(props);
  const { dialogRef, handleBackdropMouseDown, isVisible } =
    modalAccessibility;

  return (
    <QuizModalShell
      className="max-w-[430px] p-7 sm:p-8"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="no-flash-cards-title"
      onBackdropMouseDown={handleBackdropMouseDown}
      overlayClassName="bg-slate-950/30"
      zIndexClassName="z-[70]"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={props.onClose}
        className="absolute top-5 right-5 cursor-pointer rounded text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        aria-label="Close no flash cards notice"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>

      <div className="pr-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
          <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
        </div>
        <h2
          id="no-flash-cards-title"
          className="text-xl font-semibold text-slate-900"
        >
          No Flash Cards Available
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {props.message}
        </p>
      </div>
    </QuizModalShell>
  );
}
