import type { AdminQuestion } from "@/features/admin/question-bank/actions/fetch-subject-question-sets.action";
import {
  QUESTION_BANK_OPTION_LABELS,
  type QuestionBankSummary,
} from "@/features/admin/question-bank/constants/questionBank";
import { XMarkIcon } from "@heroicons/react/24/outline";

type QuestionListModalProps = {
  onClose: () => void;
  open: boolean;
  questions: AdminQuestion[];
  summary: QuestionBankSummary | null;
};

export default function QuestionListModal({
  onClose,
  open,
  questions,
  summary,
}: QuestionListModalProps) {
  return (
    <div
      className={`fixed inset-0 z-60 flex items-center justify-center px-4 transition-opacity duration-300 ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-slate-950/35" onClick={onClose}></div>

      <div
        className={`relative max-h-[88vh] w-full max-w-[760px] overflow-y-auto rounded-md bg-white p-9 shadow-xl transition-all duration-300 ease-out ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-9 right-9 cursor-pointer"
        >
          <XMarkIcon className="h-7 w-7 text-slate-500" />
        </button>

        <div className="mb-7 border-b border-slate-200 pb-6">
          <h2 className="pr-10 text-xl font-semibold text-slate-950">
            {summary?.gameType}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {summary?.difficulty} · {questions.length}{" "}
            {questions.length === 1 ? "Question" : "Questions"}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {questions.length > 0 ? (
            questions.map((question, questionIndex) => (
              <article
                key={question.id}
                className="rounded border border-slate-200 bg-slate-50 p-5"
              >
                <div className="mb-4 flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-teal-600 text-xs font-semibold text-white">
                    {questionIndex + 1}
                  </span>
                  <p className="text-sm font-medium leading-6 text-slate-950">
                    {question.question_text}
                  </p>
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  {question.question_options.map((option) => (
                    <div
                      key={option.id}
                      className={`rounded border px-3 py-2 text-sm ${
                        option.is_correct
                          ? "border-teal-600 bg-teal-50 text-teal-700"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      <span className="mr-2 font-semibold">
                        {QUESTION_BANK_OPTION_LABELS[option.sort_order - 1]}.
                      </span>
                      {option.option_text}
                    </div>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
              No questions yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
