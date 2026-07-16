import {
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEditFlashCardModal } from "@/features/app/reviewee/flash-cards/hooks/modals/useEditFlashCardModal";
import type { FlashCardDeck } from "@/features/app/reviewee/flash-cards/types/flashCard";

type EditFlashCardModalProps = {
  flashCardDeck: FlashCardDeck;
  onClose: () => void;
};

export default function EditFlashCardModal({
  flashCardDeck,
  onClose,
}: EditFlashCardModalProps) {
  const {
    addQuestion,
    dialogRef,
    firstQuestionRef,
    handleBackdropMouseDown,
    handleSubmit,
    questions,
    removeQuestion,
    updateQuestion,
  } = useEditFlashCardModal({ flashCardDeck, onClose });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 px-4 py-6"
      onMouseDown={handleBackdropMouseDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-flash-card-title"
    >
      <div
        ref={dialogRef}
        className="relative flex max-h-[calc(100vh-3rem)] w-full max-w-[680px] flex-col rounded-lg bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-6 sm:px-9">
          <div>
            <h2
              id="edit-flash-card-title"
              className="text-xl font-semibold text-slate-900"
            >
              Edit Flash Cards
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {flashCardDeck?.title} · {flashCardDeck?.area}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label="Close edit flash card modal"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-5 overflow-y-auto px-6 py-6 sm:px-9">
            {questions.map((flashCardQuestion, questionIndex) => (
              <fieldset
                key={flashCardQuestion.id}
                className="rounded-lg border border-slate-200 p-4 sm:p-5"
              >
                <legend className="sr-only">
                  Flash card {questionIndex + 1}
                </legend>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Card {questionIndex + 1}
                  </p>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeQuestion(flashCardQuestion.id)
                      }
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded text-xs font-semibold text-slate-400 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      aria-label={`Remove flash card ${questionIndex + 1}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                <label className="block text-sm font-semibold text-slate-900">
                  Question
                  <textarea
                    ref={questionIndex === 0 ? firstQuestionRef : undefined}
                    value={flashCardQuestion.question}
                    onChange={(event) =>
                      updateQuestion(
                        flashCardQuestion.id,
                        "question",
                        event.target.value,
                      )
                    }
                    required
                    rows={3}
                    className="mt-2 w-full resize-none rounded border border-slate-200 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </label>

                <label className="mt-4 block text-sm font-semibold text-slate-900">
                  Answer
                  <textarea
                    value={flashCardQuestion.answer}
                    onChange={(event) =>
                      updateQuestion(
                        flashCardQuestion.id,
                        "answer",
                        event.target.value,
                      )
                    }
                    required
                    rows={3}
                    className="mt-2 w-full resize-none rounded border border-slate-200 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </label>
              </fieldset>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="flex h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-teal-300 bg-teal-50 text-sm font-semibold text-teal-700 transition-colors hover:border-teal-400 hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <PlusIcon className="h-4 w-4" />
              Add New Question
            </button>
          </div>

          <div className="border-t border-slate-100 px-6 py-5 sm:px-9">
            <button
              type="submit"
              className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded bg-teal-600 px-5 text-base font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
