import type { AdminSubject } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import type { AdminQuestion } from "@/features/app/admin/question-bank/actions/fetch-subject-question-sets.action";
import { useDeleteQuestionConfirmationModal } from "@/features/app/admin/question-bank/hooks/modals/useDeleteQuestionConfirmationModal";
import { useModalAnimation } from "@/hooks/useModalAnimation";
import { LoaderCircle } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type DeleteQuestionConfirmationModalProps = {
  loadSubjectQuestions: (subjectId: number) => Promise<void>;
  onClose: () => void;
  question: AdminQuestion | null;
  selectedSubject: AdminSubject | null;
  showSuccessMessage: (message: string) => void;
};

export default function DeleteQuestionConfirmationModal({
  loadSubjectQuestions,
  onClose,
  question,
  selectedSubject,
  showSuccessMessage,
}: DeleteQuestionConfirmationModalProps) {
  const { deleteQuestionError, handleDeleteQuestion, isDeletingQuestion } =
    useDeleteQuestionConfirmationModal({
      loadSubjectQuestions,
      onClose,
      question,
      selectedSubject,
      showSuccessMessage,
    });
  const { closeWithAnimation, isModalVisible } = useModalAnimation(
    question !== null,
  );

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center px-4 transition-opacity duration-300 ${
        isModalVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-slate-950/35"
        onClick={() => closeWithAnimation(onClose)}
      ></div>

      <form
        onSubmit={handleDeleteQuestion}
        className={`relative w-full max-w-[430px] rounded-md bg-surface p-7 shadow-xl transition-all duration-300 ease-out ${
          isModalVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => closeWithAnimation(onClose)}
          className="absolute top-6 right-6 cursor-pointer"
        >
          <XMarkIcon className="h-6 w-6 text-secondary-text" />
        </button>

        <input type="hidden" name="questionId" value={question?.id ?? ""} />
        <input
          type="hidden"
          name="subjectId"
          value={selectedSubject?.id ?? ""}
        />

        <div className="pr-9">
          <h2 className="text-xl font-semibold text-primary-text">
            Delete Question
          </h2>
          <p className="mt-3 text-sm leading-6 text-secondary-text">
            Are you sure you want to delete this question? This action cannot be
            undone.
          </p>
        </div>

        {question && (
          <div className="mt-5 rounded border border-border bg-secondary-bg p-4">
            <p className="line-clamp-3 text-sm font-medium leading-6 text-primary-text">
              {question.question_text}
            </p>
          </div>
        )}

        {deleteQuestionError && (
          <p className="mt-4 text-sm text-error">{deleteQuestionError}</p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => closeWithAnimation(onClose)}
            className="h-11 cursor-pointer rounded border border-border bg-surface text-sm font-semibold text-primary-text transition-colors hover:border-primary-accent hover:text-primary-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDeletingQuestion}
            className="flex h-11 cursor-pointer items-center justify-center rounded bg-primary-accent text-sm font-semibold text-surface transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeletingQuestion ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Delete Question"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
