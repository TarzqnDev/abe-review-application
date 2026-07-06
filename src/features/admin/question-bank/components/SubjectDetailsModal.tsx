import type { AdminSubject } from "@/features/admin/question-bank/actions/fetch-subject-areas.action";
import type {
  QuestionBankDifficulty,
  QuestionBankSummary,
} from "@/features/admin/question-bank/constants/questionBank";
import { XMarkIcon } from "@heroicons/react/24/outline";

type SubjectSummaryGroup = {
  difficulty: QuestionBankDifficulty;
  summaries: QuestionBankSummary[];
};

type SubjectDetailsModalProps = {
  isLoadingQuestionSets: boolean;
  onAddQuestion: (summary?: QuestionBankSummary | null) => void;
  onClose: () => void;
  onEditQuestions: (summary: QuestionBankSummary) => void;
  onViewQuestions: (summary: QuestionBankSummary) => void;
  open: boolean;
  questionSetsError: string;
  subject: AdminSubject | null;
  summaryGroups: SubjectSummaryGroup[];
  totalQuestions: number;
};

export default function SubjectDetailsModal({
  isLoadingQuestionSets,
  onAddQuestion,
  onClose,
  onEditQuestions,
  onViewQuestions,
  open,
  questionSetsError,
  subject,
  summaryGroups,
  totalQuestions,
}: SubjectDetailsModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-slate-950/30" onClick={onClose}></div>

      <div
        className={`relative max-h-[88vh] w-full max-w-[935px] overflow-y-auto rounded-md bg-white p-10 shadow-xl transition-all duration-300 ease-out ${
          open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-10 right-9 cursor-pointer"
        >
          <XMarkIcon className="h-7 w-7 text-slate-500" />
        </button>

        <div className="mb-6 border-b border-slate-200 pb-6">
          <h2 className="pr-10 text-xl font-semibold text-slate-950">
            {subject?.name}
          </h2>
          <p className="mt-3 text-base text-slate-500">
            {totalQuestions} {totalQuestions === 1 ? "Question" : "Questions"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAddQuestion(null)}
          className="mb-5 h-10 w-full cursor-pointer rounded border border-slate-200 bg-white text-sm font-semibold text-slate-950 transition-colors hover:border-teal-600 hover:text-teal-600"
        >
          + Add Question
        </button>

        {isLoadingQuestionSets ? (
          <div className="rounded border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
            Loading questions...
          </div>
        ) : questionSetsError ? (
          <div className="rounded border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {questionSetsError}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {summaryGroups.map((summaryGroup) => (
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
                        <div className="mt-auto grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => onViewQuestions(summary)}
                            className="h-[30px] cursor-pointer rounded bg-teal-600 text-xs font-medium text-white transition-colors hover:bg-teal-700"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditQuestions(summary)}
                            className="h-[30px] cursor-pointer rounded border border-slate-200 bg-white text-xs font-medium text-slate-950 transition-colors hover:border-teal-600"
                          >
                            Edit
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
  );
}
