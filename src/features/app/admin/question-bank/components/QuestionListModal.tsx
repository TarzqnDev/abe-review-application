import type { AdminSubject } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import type {
  AdminQuestion,
  AdminQuestionSet,
} from "@/features/app/admin/question-bank/actions/fetch-subject-question-sets.action";
import DeleteQuestionConfirmationModal from "@/features/app/admin/question-bank/components/DeleteQuestionConfirmationModal";
import QuestionListPagination from "@/features/app/admin/question-bank/components/QuestionListPagination";
import {
  QUESTION_BANK_OPTION_LABELS,
  type QuestionBankSummary,
} from "@/features/app/admin/question-bank/constants/questionBank";
import type { QuestionListModalRequest } from "@/features/app/admin/question-bank/hooks/modals/useSubjectDetailsModal";
import { useQuestionListModal } from "@/features/app/admin/question-bank/hooks/modals/useQuestionListModal";
import { useModalAnimation } from "@/hooks/useModalAnimation";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type QuestionListModalProps = {
  isSuspended: boolean;
  loadSubjectQuestions: (subjectId: number) => Promise<void>;
  onAddQuestion: (summary: QuestionBankSummary) => void;
  onClose: () => void;
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
  isSuspended,
  loadSubjectQuestions,
  onAddQuestion,
  onClose,
  onEditQuestion,
  questionSets,
  request,
  selectedSubject,
  showSuccessMessage,
}: QuestionListModalProps) {
  const {
    activeQuestionSetQuestions,
    activeQuestionSummary,
    currentPage,
    filteredQuestionCount,
    firstQuestionNumber,
    handleAddQuestion,
    handleCloseDeleteConfirmation,
    handleCloseQuestionListModal,
    handleOpenDeleteConfirmation,
    handleOpenEditQuestion,
    handlePageChange,
    handleSearchQueryChange,
    lastQuestionNumber,
    openQuestionListModal,
    paginatedQuestions,
    searchQuery,
    selectedDeleteQuestion,
    totalPages,
  } = useQuestionListModal({
    onAddQuestion,
    onClose,
    onEditQuestion,
    questionSets,
    request,
  });
  const { closeWithAnimation, isModalVisible } = useModalAnimation(
    openQuestionListModal,
  );
  const isChildModalOpen = isSuspended || selectedDeleteQuestion !== null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-opacity duration-300 ${
          isModalVisible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isModalVisible || isChildModalOpen}
        inert={isChildModalOpen}
      >
        <div
          className="absolute inset-0 bg-slate-950/35"
          onClick={() => closeWithAnimation(handleCloseQuestionListModal)}
        ></div>

        <div
          className={`relative max-h-[88vh] w-full max-w-[935px] overflow-y-auto rounded-md bg-white p-10 shadow-xl transition-all duration-300 ease-out ${
            isModalVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-95 opacity-0"
          }`}
        >
          <div className="mb-5 flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                {selectedSubject?.name}
              </h2>
              <p className="mt-2 text-base font-medium text-slate-500">
                {activeQuestionSummary?.gameType} ({activeQuestionSummary?.difficulty}){" "}
                • {activeQuestionSetQuestions.length}{" "}
                {activeQuestionSetQuestions.length === 1
                  ? "Question"
                  : "Questions"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <label className="relative min-w-0 flex-1 sm:w-[275px] sm:flex-none">
                <span className="sr-only">Search questions</span>
                <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  placeholder="Search a question"
                  className="h-10 w-full rounded-full border border-slate-200 bg-white pr-4 pl-10 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#009688] focus:ring-2 focus:ring-[#E0F2F1]"
                />
              </label>
              <button
                type="button"
                onClick={() => closeWithAnimation(handleCloseQuestionListModal)}
                className="shrink-0 cursor-pointer rounded text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009688]"
                aria-label="Close question list"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddQuestion}
            className="mb-5 flex h-10 w-full cursor-pointer items-center justify-center rounded border border-slate-200 bg-white text-sm font-semibold text-slate-950 transition-colors hover:border-[#009688] hover:text-[#009688] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009688]"
          >
            + Add Question
          </button>

          <div className="flex flex-col gap-3">
            {paginatedQuestions.length > 0 ? (
              paginatedQuestions.map((question) => {
              const correctOption = question.question_options.find(
                (option) => option.is_correct,
              );
              const questionNumber =
                activeQuestionSetQuestions.findIndex(
                  (activeQuestion) => activeQuestion.id === question.id,
                ) + 1;

              return (
                <article
                  key={question.id}
                  className="rounded border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-sm font-semibold text-slate-950">
                      Question # {questionNumber}
                    </h3>
                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenEditQuestion(question)}
                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-[#009688] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009688]"
                        aria-label={`Edit question ${questionNumber}`}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteConfirmation(question)}
                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        aria-label={`Delete question ${questionNumber}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-5 text-slate-950">
                    {question.question_text}
                  </p>

                  <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-slate-950">
                      Answer:
                    </p>
                    {correctOption ? (
                      <div className="rounded border border-[#009688] bg-[#E0F2F1] px-3 py-2 text-sm font-medium text-[#009688]">
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
                {searchQuery.trim()
                  ? "No questions match your search."
                  : "No questions yet."}
              </div>
            )}
          </div>

          <QuestionListPagination
            currentPage={currentPage}
            firstQuestionNumber={firstQuestionNumber}
            lastQuestionNumber={lastQuestionNumber}
            onPageChange={handlePageChange}
            totalQuestions={filteredQuestionCount}
            totalPages={totalPages}
          />
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
    </>
  );
}
