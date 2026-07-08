import type { AdminSubject } from "@/features/admin/question-bank/actions/fetch-subject-areas.action";
import type {
  AdminQuestion,
  AdminQuestionSet,
} from "@/features/admin/question-bank/actions/fetch-subject-question-sets.action";
import DeleteQuestionConfirmationModal from "@/features/admin/question-bank/components/DeleteQuestionConfirmationModal";
import {
  QUESTION_BANK_OPTION_LABELS,
  type QuestionBankSummary,
} from "@/features/admin/question-bank/constants/questionBank";
import type { QuestionListModalRequest } from "@/features/admin/question-bank/hooks/modals/useSubjectDetailsModal";
import { useQuestionListModal } from "@/features/admin/question-bank/hooks/modals/useQuestionListModal";
import { useModalAnimation } from "@/hooks/useModalAnimation";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

type QuestionListModalProps = {
  loadSubjectQuestions: (subjectId: number) => Promise<void>;
  onEditQuestion: (
    summary: QuestionBankSummary,
    question: AdminQuestion,
  ) => void;
  questionSets: AdminQuestionSet[];
  request: QuestionListModalRequest | null;
  selectedSubject: AdminSubject | null;
  showSuccessMessage: (message: string) => void;
};

export default function QuestionListModal({
  loadSubjectQuestions,
  onEditQuestion,
  questionSets,
  request,
  selectedSubject,
  showSuccessMessage,
}: QuestionListModalProps) {
  const {
    activeQuestionSetQuestions,
    activeQuestionSummary,
    handleCloseDeleteConfirmation,
    handleCloseQuestionListModal,
    handleOpenDeleteConfirmation,
    handleOpenEditQuestion,
    openQuestionListModal,
    selectedDeleteQuestion,
  } = useQuestionListModal({
    onEditQuestion,
    questionSets,
    request,
  });
  const { closeWithAnimation, isModalVisible } = useModalAnimation(
    openQuestionListModal,
  );

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-opacity duration-300 ${
        isModalVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-slate-950/35"
        onClick={() => closeWithAnimation(handleCloseQuestionListModal)}
      ></div>

      <div
        className={`relative max-h-[88vh] w-full max-w-[760px] overflow-y-auto rounded-md bg-white p-9 shadow-xl transition-all duration-300 ease-out ${
          isModalVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => closeWithAnimation(handleCloseQuestionListModal)}
          className="absolute top-9 right-9 cursor-pointer"
        >
          <XMarkIcon className="h-7 w-7 text-slate-500" />
        </button>

        <div className="mb-7 border-b border-slate-200 pb-6">
          <h2 className="pr-10 text-xl font-semibold text-slate-950">
            {activeQuestionSummary?.gameType}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {activeQuestionSummary?.difficulty} ·{" "}
            {activeQuestionSetQuestions.length}{" "}
            {activeQuestionSetQuestions.length === 1 ? "Question" : "Questions"}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {activeQuestionSetQuestions.length > 0 ? (
            activeQuestionSetQuestions.map((question, questionIndex) => {
              const correctOption = question.question_options.find(
                (option) => option.is_correct,
              );

              return (
                <article
                  key={question.id}
                  className="rounded border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h3 className="text-sm font-semibold text-slate-950">
                      Question #{questionIndex + 1}
                    </h3>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditQuestion(question)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-slate-200 bg-white text-slate-500 transition-colors hover:border-teal-600 hover:text-teal-600"
                        aria-label={`Edit question ${questionIndex + 1}`}
                        title="Edit question"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteConfirmation(question)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-slate-200 bg-white text-slate-500 transition-colors hover:border-red-500 hover:text-red-500"
                        aria-label={`Delete question ${questionIndex + 1}`}
                        title="Delete question"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-medium leading-6 text-slate-950">
                    {question.question_text}
                  </p>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-slate-950">
                      Answer:
                    </p>
                    {correctOption ? (
                      <div className="rounded bg-teal-600 px-3 py-2 text-sm font-medium text-white">
                        <span className="mr-2 font-semibold">
                          {
                            QUESTION_BANK_OPTION_LABELS[
                              correctOption.sort_order - 1
                            ]
                          }
                          .
                        </span>
                        {correctOption.option_text}
                      </div>
                    ) : (
                      <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                        No correct answer selected.
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
              No questions yet.
            </div>
          )}
        </div>
      </div>

      {/* Modals Section */}
      <DeleteQuestionConfirmationModal
        key={selectedDeleteQuestion?.id ?? "delete-question-confirmation-modal"}
        loadSubjectQuestions={loadSubjectQuestions}
        onClose={handleCloseDeleteConfirmation}
        question={selectedDeleteQuestion}
        selectedSubject={selectedSubject}
        showSuccessMessage={showSuccessMessage}
      />
    </div>
  );
}
