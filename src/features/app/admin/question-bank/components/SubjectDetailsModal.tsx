import type { AdminSubject } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import QuestionFormModal from "@/features/app/admin/question-bank/components/QuestionFormModal";
import QuestionListModal from "@/features/app/admin/question-bank/components/QuestionListModal";
import SubjectDetailsSkeleton from "@/features/app/admin/question-bank/components/SubjectDetailsSkeleton";
import { useSubjectDetailsModal } from "@/features/app/admin/question-bank/hooks/modals/useSubjectDetailsModal";
import { useModalAnimation } from "@/hooks/useModalAnimation";
import { XMarkIcon } from "@heroicons/react/24/outline";

type SubjectDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  showSuccessMessage: (message: string) => void;
  subject: AdminSubject | null;
};

export default function SubjectDetailsModal({
  open,
  onClose,
  showSuccessMessage,
  subject,
}: SubjectDetailsModalProps) {
  const {
    activeSubjectQuestionSets,
    handleCloseQuestionFormModal,
    handleCloseQuestionListModal,
    handleCloseSubjectDetails,
    handleOpenCreateQuestionModal,
    handleOpenEditQuestionModal,
    handleOpenQuestionListModal,
    isLoadingQuestionSets,
    loadSubjectQuestions,
    questionFormRequest,
    questionListRequest,
    questionSetsError,
    questionSummaries,
    selectedSubjectSummariesByDifficulty,
    selectedSubjectTotalQuestions,
  } = useSubjectDetailsModal({
    onClose,
    subject,
  });
  const { closeWithAnimation, isModalVisible } = useModalAnimation(open);
  const isChildModalOpen = Boolean(questionFormRequest || questionListRequest);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
          isModalVisible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isModalVisible || isChildModalOpen}
        inert={isChildModalOpen}
      >
        <div
          className="absolute inset-0 bg-slate-950/30"
          onClick={() => closeWithAnimation(handleCloseSubjectDetails)}
        ></div>

        <div
          className={`relative max-h-[88vh] w-full max-w-[935px] overflow-y-auto rounded-md bg-white p-10 shadow-xl transition-all duration-300 ease-out ${
            isModalVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-95 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => closeWithAnimation(handleCloseSubjectDetails)}
            className="absolute top-10 right-9 cursor-pointer"
          >
            <XMarkIcon className="h-7 w-7 text-slate-500" />
          </button>

          <div className="mb-6 border-b border-slate-200 pb-6">
            <h2 className="pr-10 text-xl font-semibold text-slate-950">
              {subject?.name}
            </h2>
            <p className="mt-3 text-base text-slate-500">
              {selectedSubjectTotalQuestions}{" "}
              {selectedSubjectTotalQuestions === 1 ? "Question" : "Questions"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCreateQuestionModal(null)}
            className="mb-5 h-10 w-full cursor-pointer rounded border border-slate-200 bg-white text-sm font-semibold text-slate-950 transition-colors hover:border-teal-600 hover:text-teal-600"
          >
            + Add Question
          </button>

          {isLoadingQuestionSets ? (
            <SubjectDetailsSkeleton />
          ) : questionSetsError ? (
            <div className="rounded border border-red-200 bg-red-50 p-5 text-sm text-red-600">
              {questionSetsError}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {selectedSubjectSummariesByDifficulty.map((summaryGroup) => (
                <section key={summaryGroup.difficulty}>
                  <h3 className="mb-2 text-sm font-semibold text-slate-950">
                    {summaryGroup.difficulty}
                  </h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    {summaryGroup.summaries.map((summary) => (
                      <div
                        key={`${summary.difficulty}-${summary.gameType}`}
                        className="flex min-h-[135px] flex-col rounded border border-slate-200 bg-slate-50 px-2.5 py-4 text-center"
                      >
                        <h4 className="text-sm font-medium text-slate-950">
                          {summary.gameType}
                        </h4>
                        <p className="mt-3 text-sm font-medium text-teal-600">
                          {summary.questionCount}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">Questions</p>

                        {summary.questionCount > 0 && (
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenQuestionListModal(summary)
                              }
                              className="h-[30px] w-full cursor-pointer rounded bg-teal-600 text-xs font-medium text-white transition-colors hover:bg-teal-700"
                            >
                              View Questions
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals Section */}
      <QuestionFormModal
        key={questionFormRequest?.requestId ?? "question-form-modal"}
        loadSubjectQuestions={loadSubjectQuestions}
        onClose={handleCloseQuestionFormModal}
        questionSets={activeSubjectQuestionSets}
        questionSummaries={questionSummaries}
        request={questionFormRequest}
        selectedSubject={subject}
        showSuccessMessage={showSuccessMessage}
      />

      <QuestionListModal
        key={questionListRequest?.requestId ?? "question-list-modal"}
        isSuspended={questionFormRequest !== null}
        loadSubjectQuestions={loadSubjectQuestions}
        onAddQuestion={handleOpenCreateQuestionModal}
        onClose={handleCloseQuestionListModal}
        onEditQuestion={handleOpenEditQuestionModal}
        questionSets={activeSubjectQuestionSets}
        request={questionListRequest}
        selectedSubject={subject}
        showSuccessMessage={showSuccessMessage}
      />
    </>
  );
}
