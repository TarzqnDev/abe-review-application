import type { AdminSubject } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import {
  QUESTION_BANK_OPTION_LABELS,
} from "@/features/app/admin/question-bank/constants/questionBank";
import {
  type PaesQuestionFormRequest,
  usePaesQuestionFormModal,
} from "@/features/app/admin/question-bank/hooks/modals/usePaesQuestionFormModal";
import { useModalAnimation } from "@/hooks/useModalAnimation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";

type PaesQuestionFormData = {
  correctOptionSortOrder: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  questionText: string;
  subjectId: string;
};

type PaesQuestionFormModalProps = {
  isSubjectLocked?: boolean;
  onClose: () => void;
  onSaved?: (subjectId: number) => Promise<void>;
  request: PaesQuestionFormRequest | null;
  showSuccessMessage: (message: string) => void;
  subjects: AdminSubject[];
};

export default function PaesQuestionFormModal({
  isSubjectLocked = false,
  onClose,
  onSaved,
  request,
  showSuccessMessage,
  subjects,
}: PaesQuestionFormModalProps) {
  const {
    handleClosePaesQuestionFormModal,
    handleQuestionInput,
    handleSaveQuestion,
    isSavingQuestion,
    openPaesQuestionFormModal,
    questionFormData,
    questionFormError,
    questionFormMode,
    selectedEditQuestion,
  } = usePaesQuestionFormModal({
    onClose,
    onSaved,
    request,
    showSuccessMessage,
    subjects,
  });
  const { closeWithAnimation, isModalVisible } = useModalAnimation(
    openPaesQuestionFormModal,
  );
  const isEditMode = questionFormMode === "edit";

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center px-4 transition-opacity duration-300 ${
        isModalVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-slate-950/35"
        onClick={() =>
          closeWithAnimation(handleClosePaesQuestionFormModal)
        }
      ></div>

      <div
        className={`relative max-h-[88vh] w-full max-w-[800px] overflow-hidden rounded-md bg-surface shadow-xl transition-all duration-300 ease-out sm:overflow-y-auto sm:p-10 ${
          isModalVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="max-h-[88vh] overflow-y-auto p-6 pb-28 sm:contents">
          <button
          type="button"
          onClick={() =>
            closeWithAnimation(handleClosePaesQuestionFormModal)
          }
          className="absolute top-10 right-9 cursor-pointer"
          aria-label="Close PAES question form"
        >
          <XMarkIcon className="h-7 w-7 text-secondary-text" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-primary-text">
            {isEditMode ? "Edit Question" : "Add Question"}
          </h2>
        </div>

        <form
          id="paes-question-form"
          onSubmit={handleSaveQuestion}
          className="flex flex-col gap-5"
        >
          {isSubjectLocked && (
            <input
              type="hidden"
              name="subjectId"
              value={questionFormData.subjectId}
            />
          )}
          {isEditMode && (
            <input
              type="hidden"
              name="questionId"
              value={selectedEditQuestion?.id ?? ""}
            />
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="paesSubjectId" className="text-base font-semibold">
              PAES Series
            </label>
            <select
              id="paesSubjectId"
              name={isSubjectLocked ? undefined : "subjectId"}
              value={questionFormData.subjectId}
              onChange={handleQuestionInput}
              disabled={isSubjectLocked || subjects.length === 0}
              className="h-[50px] rounded border border-border bg-surface px-5 text-base outline-none focus:border-primary-accent disabled:cursor-not-allowed disabled:bg-secondary-bg"
            >
              {subjects.length === 0 && (
                <option value="">No PAES subjects available</option>
              )}
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="paesQuestionText" className="text-base font-semibold">
              Question
            </label>
            <textarea
              id="paesQuestionText"
              name="questionText"
              value={questionFormData.questionText}
              onChange={handleQuestionInput}
              rows={5}
              maxLength={1000}
              className="resize-none rounded border border-border px-4 py-3 text-sm outline-none focus:border-primary-accent"
            />
          </div>

          <div>
            <p className="mb-5 text-sm font-medium text-secondary-text">
              Fill out the options and select the correct answer
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              {[1, 2, 3, 4].map((optionNumber) => (
                <div key={optionNumber} className="flex flex-col gap-2">
                  <label
                    htmlFor={`paesOption${optionNumber}`}
                    className="text-base font-semibold"
                  >
                    Option {QUESTION_BANK_OPTION_LABELS[optionNumber - 1]}
                  </label>
                  <div className="flex h-[50px] items-center gap-3 rounded border border-border bg-surface px-3 focus-within:border-primary-accent">
                    <input
                      type="radio"
                      name="correctOptionSortOrder"
                      value={optionNumber}
                      checked={
                        questionFormData.correctOptionSortOrder ===
                        String(optionNumber)
                      }
                      onChange={handleQuestionInput}
                      className="h-4 w-4 shrink-0 accent-primary-accent"
                    />
                    <input
                      id={`paesOption${optionNumber}`}
                      type="text"
                      name={`option${optionNumber}`}
                      value={
                        questionFormData[
                          `option${optionNumber}` as keyof PaesQuestionFormData
                        ]
                      }
                      onChange={handleQuestionInput}
                      maxLength={255}
                      className="min-w-0 flex-1 text-sm outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingQuestion || subjects.length === 0}
            className="hidden h-[50px] cursor-pointer items-center justify-center rounded bg-primary-accent px-5 text-base font-semibold text-surface transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70 sm:flex"
          >
            {isSavingQuestion ? (
              <LoaderCircle className="animate-spin" />
            ) : isEditMode ? (
              "Save Question"
            ) : (
              "Create Question"
            )}
          </button>

          {questionFormError && (
            <p className="text-sm text-error">{questionFormError}</p>
          )}
          </form>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-surface px-6 pt-3 pb-6 shadow-[0_-8px_18px_rgba(15,23,42,0.08)] sm:hidden">
          <button
            type="submit"
            form="paes-question-form"
            disabled={isSavingQuestion || subjects.length === 0}
            className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded bg-primary-accent px-5 text-base font-semibold text-surface transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSavingQuestion ? (
              <LoaderCircle className="animate-spin" />
            ) : isEditMode ? (
              "Save Question"
            ) : (
              "Create Question"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
