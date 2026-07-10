import React, { useMemo, useState } from "react";
import { createQuestion } from "@/features/app/admin/question-bank/actions/create-question.action";
import type { AdminSubject } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import {
  type AdminQuestion,
  type AdminQuestionSet,
} from "@/features/app/admin/question-bank/actions/fetch-subject-question-sets.action";
import { updateQuestion } from "@/features/app/admin/question-bank/actions/update-question.action";
import {
  type QuestionBankDifficulty,
  type QuestionBankGameType,
  type QuestionBankSummary,
} from "@/features/app/admin/question-bank/constants/questionBank";
import type { QuestionFormModalRequest } from "@/features/app/admin/question-bank/hooks/modals/useSubjectDetailsModal";
import { handleFormChange } from "@/lib/utils";

type QuestionFormMode = "create" | "edit";

type QuestionFormData = {
  correctOptionSortOrder: string;
  difficulty: QuestionBankDifficulty;
  gameType: QuestionBankGameType;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  questionText: string;
};

type UseQuestionFormModalProps = {
  loadSubjectQuestions: (subjectId: number) => Promise<void>;
  questionSets: AdminQuestionSet[];
  questionSummaries: QuestionBankSummary[];
  request: QuestionFormModalRequest | null;
  selectedSubject: AdminSubject | null;
  showSuccessMessage: (message: string) => void;
};

const initialQuestionFormData: QuestionFormData = {
  correctOptionSortOrder: "",
  difficulty: "Easy",
  gameType: "Guess the Word",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  questionText: "",
};

const getQuestionFormData = (question: AdminQuestion): QuestionFormData => {
  const correctOption = question.question_options.find(
    (option) => option.is_correct,
  );

  return {
    correctOptionSortOrder: correctOption
      ? String(correctOption.sort_order)
      : "",
    difficulty: initialQuestionFormData.difficulty,
    gameType: initialQuestionFormData.gameType,
    option1: question.question_options[0]?.option_text ?? "",
    option2: question.question_options[1]?.option_text ?? "",
    option3: question.question_options[2]?.option_text ?? "",
    option4: question.question_options[3]?.option_text ?? "",
    questionText: question.question_text,
  };
};

const getRequestSummary = (
  request: QuestionFormModalRequest | null,
  questionSummaries: QuestionBankSummary[],
) =>
  request?.summary ??
  questionSummaries[0] ?? {
    difficulty: "Easy" as QuestionBankDifficulty,
    gameType: "Guess the Word" as QuestionBankGameType,
    questionCount: 0,
    questionSetId: null,
  };

const getQuestionSet = (
  questionSets: AdminQuestionSet[],
  summary: QuestionBankSummary | null,
) => {
  if (!summary) return null;

  return (
    questionSets.find(
      (questionSet) =>
        questionSet.game_type === summary.gameType &&
        questionSet.difficulty === summary.difficulty,
    ) ?? null
  );
};

export const useQuestionFormModal = ({
  loadSubjectQuestions,
  questionSets,
  questionSummaries,
  request,
  selectedSubject,
  showSuccessMessage,
}: UseQuestionFormModalProps) => {
  const initialQuestionSummary = getRequestSummary(request, questionSummaries);
  const initialQuestionSet = getQuestionSet(questionSets, initialQuestionSummary);
  const initialEditQuestion =
    initialQuestionSet?.questions.find(
      (question) => question.id === request?.questionId,
    ) ??
    initialQuestionSet?.questions[0] ??
    null;
  const shouldOpenQuestionForm =
    request !== null && (request.mode === "create" || initialEditQuestion !== null);

  const [openQuestionFormModal, setOpenQuestionFormModal] = useState(
    shouldOpenQuestionForm,
  );
  const [questionFormMode] = useState<QuestionFormMode>(
    request?.mode ?? "create",
  );
  const [questionFormData, setQuestionFormData] = useState<QuestionFormData>(() => {
    if (
      request?.mode === "edit" &&
      initialEditQuestion &&
      initialQuestionSummary
    ) {
      return {
        ...getQuestionFormData(initialEditQuestion),
        difficulty: initialQuestionSummary.difficulty,
        gameType: initialQuestionSummary.gameType,
      };
    }

    return {
      ...initialQuestionFormData,
      difficulty: initialQuestionSummary.difficulty,
      gameType: initialQuestionSummary.gameType,
    };
  });
  const [questionFormError, setQuestionFormError] = useState("");
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const [activeQuestionSummary] = useState<QuestionBankSummary | null>(
    initialQuestionSummary,
  );
  const [selectedEditQuestionId, setSelectedEditQuestionId] = useState<
    number | null
  >(initialEditQuestion?.id ?? null);

  const handleQuestionInput = handleFormChange(
    questionFormData,
    setQuestionFormData,
  );

  const activeQuestionSet = useMemo(
    () => getQuestionSet(questionSets, activeQuestionSummary),
    [activeQuestionSummary, questionSets],
  );

  const activeQuestionSetQuestions = activeQuestionSet?.questions ?? [];

  const selectedEditQuestion =
    activeQuestionSetQuestions.find(
      (question) => question.id === selectedEditQuestionId,
    ) ?? null;

  const handleCloseQuestionFormModal = () => {
    setOpenQuestionFormModal(false);
    setQuestionFormError("");
    setSelectedEditQuestionId(null);
  };

  const handleSaveQuestion = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault();

      if (!selectedSubject) {
        setQuestionFormError("A valid subject is required");
        return;
      }

      setQuestionFormError("");
      setIsSavingQuestion(true);

      const formDataSubmission = new FormData(event.currentTarget);
      const result =
        questionFormMode === "edit"
          ? await updateQuestion(formDataSubmission)
          : await createQuestion(formDataSubmission);

      if (!result.success) {
        setQuestionFormError(result.error ?? result.message);
        return;
      }

      showSuccessMessage(result.message);
      setOpenQuestionFormModal(false);
      setSelectedEditQuestionId(null);
      await loadSubjectQuestions(selectedSubject.id);
    } finally {
      setIsSavingQuestion(false);
    }
  };

  return {
    activeQuestionSummary,
    handleCloseQuestionFormModal,
    handleQuestionInput,
    handleSaveQuestion,
    isSavingQuestion,
    openQuestionFormModal,
    questionFormData,
    questionFormError,
    questionFormMode,
    selectedEditQuestion,
    selectedEditQuestionId,
  };
};
