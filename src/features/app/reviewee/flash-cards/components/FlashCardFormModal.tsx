import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import {
  type FlashCardFormModalRequest,
  useFlashCardFormModal,
} from "@/features/app/reviewee/flash-cards/hooks/modals/useFlashCardFormModal";
import type { FlashCardDeck } from "@/features/app/reviewee/flash-cards/types/flashCard";
import { useModalAnimation } from "@/hooks/useModalAnimation";

type FlashCardFormModalProps = {
  flashCardDecks: FlashCardDeck[];
  loadFlashCardDecks: () => Promise<void>;
  onClose: () => void;
  request: FlashCardFormModalRequest | null;
  showSuccessMessage: (message: string) => void;
};

export default function FlashCardFormModal({
  flashCardDecks,
  loadFlashCardDecks,
  onClose,
  request,
  showSuccessMessage,
}: FlashCardFormModalProps) {
  const {
    answer,
    areaId,
    dialogRef,
    formError,
    handleAreaChange,
    handleClose,
    handleSaveFlashCard,
    isEditMode,
    isOpen,
    isSaving,
    question,
    questionInputRef,
    setAnswer,
    setQuestion,
  } = useFlashCardFormModal({
    flashCardDecks,
    loadFlashCardDecks,
    onClose,
    request,
    showSuccessMessage,
  });
  const { closeWithAnimation, isModalVisible } = useModalAnimation(isOpen);
  const modalTitle = isEditMode ? "Edit Flash Card" : "Create Flash Card";

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto px-4 py-6 transition-opacity duration-300 ${
        isModalVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="flash-card-form-modal-title"
      aria-hidden={!isModalVisible}
    >
      <div
        className="absolute inset-0 bg-slate-950/35"
        onClick={() => closeWithAnimation(handleClose)}
      ></div>

      <div
        ref={dialogRef}
        className={`relative max-h-[calc(100vh-3rem)] w-full max-w-[525px] overflow-y-auto rounded-md bg-white px-6 py-8 shadow-xl transition-all duration-300 ease-out sm:px-9 sm:py-10 ${
          isModalVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2
            id="flash-card-form-modal-title"
            className="text-xl font-semibold text-slate-950"
          >
            {modalTitle}
          </h2>
          <button
            type="button"
            onClick={() => closeWithAnimation(handleClose)}
            disabled={isSaving}
            className="cursor-pointer rounded text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Close ${modalTitle.toLowerCase()} modal`}
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <form onSubmit={handleSaveFlashCard} className="space-y-5">
          <label
            htmlFor="flash-card-area"
            className="block text-sm font-semibold text-slate-950"
          >
            Area
            <span className="relative mt-2 block">
              <select
                id="flash-card-area"
                value={areaId ?? ""}
                onChange={handleAreaChange}
                disabled={request?.lockArea || isEditMode || isSaving}
                required
                className="h-[50px] w-full appearance-none rounded border border-slate-200 bg-white px-4 pr-11 text-base font-medium text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
              >
                {flashCardDecks.length === 0 && (
                  <option value="">No areas available</option>
                )}
                {flashCardDecks.map((flashCardDeck) => (
                  <option
                    key={flashCardDeck.areaId}
                    value={flashCardDeck.areaId}
                  >
                    {flashCardDeck.areaName}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
            </span>
          </label>

          <label
            htmlFor="flash-card-question"
            className="block text-sm font-semibold text-slate-950"
          >
            Question
            <textarea
              ref={questionInputRef}
              id="flash-card-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              disabled={isSaving}
              required
              rows={4}
              maxLength={2000}
              placeholder="Enter your question"
              className="mt-2 w-full resize-none rounded border border-slate-200 px-4 py-3 text-base font-normal text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </label>

          <label
            htmlFor="flash-card-answer"
            className="block text-sm font-semibold text-slate-950"
          >
            Answer
            <textarea
              id="flash-card-answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={isSaving}
              required
              rows={4}
              maxLength={1000}
              placeholder="Enter the answer"
              className="mt-2 w-full resize-none rounded border border-slate-200 px-4 py-3 text-base font-normal text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </label>

          {formError && (
            <p role="alert" className="text-sm text-red-500">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving || flashCardDecks.length === 0}
            className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded bg-teal-600 px-5 text-base font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : isEditMode ? (
              "Save Flash Card"
            ) : (
              "Create Flash Card"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
