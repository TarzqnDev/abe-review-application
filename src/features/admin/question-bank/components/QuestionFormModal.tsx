import type { AdminSubject } from "@/features/admin/question-bank/actions/fetch-subject-areas.action";
import type { AdminQuestion } from "@/features/admin/question-bank/actions/fetch-subject-question-sets.action";
import {
  QUESTION_BANK_DIFFICULTIES,
  QUESTION_BANK_GAME_TYPES,
  QUESTION_BANK_GAME_TYPE_FIELDS,
  QUESTION_BANK_OPTION_LABELS,
} from "@/features/admin/question-bank/constants/questionBank";
import { LoaderCircle } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type QuestionFormData = {
  correctOptionSortOrder: string;
  difficulty: string;
  gameType: string;
  hint: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  questionText: string;
  situation: string;
  statementA: string;
  statementB: string;
};

type QuestionFormModalProps = {
  error: string;
  formData: QuestionFormData;
  isSaving: boolean;
  mode: "create" | "edit";
  onClose: () => void;
  onInput: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSave: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onSelectEditQuestion: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  open: boolean;
  questions: AdminQuestion[];
  selectedEditQuestionId: number | null;
  subject: AdminSubject | null;
};

export default function QuestionFormModal({
  error,
  formData,
  isSaving,
  mode,
  onClose,
  onInput,
  onSave,
  onSelectEditQuestion,
  open,
  questions,
  selectedEditQuestionId,
  subject,
}: QuestionFormModalProps) {
  const isEditMode = mode === "edit";
  const gameTypeFields =
    QUESTION_BANK_GAME_TYPE_FIELDS[
      formData.gameType as keyof typeof QUESTION_BANK_GAME_TYPE_FIELDS
    ] ?? [];
  const fieldsBeforeQuestion =
    formData.gameType === "Situationship" ? gameTypeFields : [];
  const fieldsAfterQuestion =
    formData.gameType === "Situationship" ? [] : gameTypeFields;
  const showQuestionField = formData.gameType !== "AB-Solution";

  const renderGameTypeField = (
    field: (typeof gameTypeFields)[number],
  ) => (
    <div key={field.name} className="flex flex-col gap-2">
      <label htmlFor={field.name} className="text-sm font-semibold">
        {field.label}
        {field.optional && (
          <span className="font-normal text-slate-500"> (Optional)</span>
        )}
      </label>
      <textarea
        id={field.name}
        name={field.name}
        value={formData[field.name as keyof QuestionFormData]}
        onChange={onInput}
        rows={field.rows}
        maxLength={field.maxLength}
        className="resize-none rounded border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
      />
    </div>
  );

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

        <div className="mb-7">
          <h2 className="text-xl font-semibold text-slate-950">
            {isEditMode ? "Edit Question" : "Add New Question"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{subject?.name}</p>
        </div>

        <form onSubmit={onSave} className="flex flex-col gap-5">
          <input type="hidden" name="subjectId" value={subject?.id ?? ""} />
          {isEditMode && (
            <input
              type="hidden"
              name="questionId"
              value={selectedEditQuestionId ?? ""}
            />
          )}

          {isEditMode && questions.length > 1 && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="questionSelector"
                className="text-sm font-semibold"
              >
                Question
              </label>
              <select
                id="questionSelector"
                value={selectedEditQuestionId ?? ""}
                onChange={onSelectEditQuestion}
                className="h-[46px] rounded border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-600"
              >
                {questions.map((question, questionIndex) => (
                  <option key={question.id} value={question.id}>
                    Question {questionIndex + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="gameType" className="text-sm font-semibold">
                Game Type
              </label>
              <select
                id="gameType"
                name="gameType"
                value={formData.gameType}
                onChange={onInput}
                className="h-[46px] rounded border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-600"
              >
                {QUESTION_BANK_GAME_TYPES.map((gameType) => (
                  <option key={gameType} value={gameType}>
                    {gameType}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="difficulty" className="text-sm font-semibold">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={onInput}
                className="h-[46px] rounded border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-600"
              >
                {QUESTION_BANK_DIFFICULTIES.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {fieldsBeforeQuestion.map(renderGameTypeField)}

          {showQuestionField && (
            <div className="flex flex-col gap-2">
              <label htmlFor="questionText" className="text-sm font-semibold">
                Question
              </label>
              <textarea
                id="questionText"
                name="questionText"
                value={formData.questionText}
                onChange={onInput}
                rows={4}
                maxLength={1000}
                className="resize-none rounded border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
              />
            </div>
          )}

          {fieldsAfterQuestion.map(renderGameTypeField)}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-950">
                Answer Choices
              </h3>
              <span className="text-xs text-slate-500">
                Select the correct answer
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[1, 2, 3, 4].map((optionNumber) => (
                <label
                  key={optionNumber}
                  className="flex items-center gap-3 rounded border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <input
                    type="radio"
                    name="correctOptionSortOrder"
                    value={optionNumber}
                    checked={
                      formData.correctOptionSortOrder === String(optionNumber)
                    }
                    onChange={onInput}
                    className="h-4 w-4 accent-teal-600"
                  />
                  <input
                    type="text"
                    name={`option${optionNumber}`}
                    value={
                      formData[
                        `option${optionNumber}` as keyof QuestionFormData
                      ]
                    }
                    onChange={onInput}
                    maxLength={255}
                    placeholder={`Choice ${
                      QUESTION_BANK_OPTION_LABELS[optionNumber - 1]
                    }`}
                    className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex h-[50px] cursor-pointer items-center justify-center rounded bg-teal-600 px-5 text-base font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? (
              <LoaderCircle className="animate-spin" />
            ) : isEditMode ? (
              "Save Question"
            ) : (
              "Create Question"
            )}
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
