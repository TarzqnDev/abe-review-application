import React, { useMemo, useState } from "react";
import { createQuestion } from "@/features/admin/question-bank/actions/create-question.action";
import type { AdminSubject } from "@/features/admin/question-bank/actions/fetch-subject-areas.action";
import {
  type AdminQuestion,
  type AdminQuestionSet,
} from "@/features/admin/question-bank/actions/fetch-subject-question-sets.action";
import { updateQuestion } from "@/features/admin/question-bank/actions/update-question.action";
import {
  type QuestionBankDifficulty,
  type QuestionBankGameType,
  type QuestionBankSummary,
} from "@/features/admin/question-bank/constants/questionBank";
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

export const useQuestionFormModal = ({
  loadSubjectQuestions,
  questionSets,
  questionSummaries,
  selectedSubject,
  showSuccessMessage,
}: UseQuestionFormModalProps) => {
  const [openQuestionFormModal, setOpenQuestionFormModal] = useState(false);
  const [questionFormMode, setQuestionFormMode] =
    useState<QuestionFormMode>("create");
  const [questionFormData, setQuestionFormData] = useState<QuestionFormData>(
    initialQuestionFormData,
  );
  const [questionFormError, setQuestionFormError] = useState("");
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const [activeQuestionSummary, setActiveQuestionSummary] =
    useState<QuestionBankSummary | null>(null);
  const [selectedEditQuestionId, setSelectedEditQuestionId] = useState<
    number | null
  >(null);

  const handleQuestionInput = handleFormChange(
    questionFormData,
    setQuestionFormData,
  );

  const activeQuestionSet = useMemo(() => {
    if (!activeQuestionSummary) return null;

    return (
      questionSets.find(
        (questionSet) =>
          questionSet.game_type === activeQuestionSummary.gameType &&
          questionSet.difficulty === activeQuestionSummary.difficulty,
      ) ?? null
    );
  }, [activeQuestionSummary, questionSets]);

  const activeQuestionSetQuestions = activeQuestionSet?.questions ?? [];

  const selectedEditQuestion =
    activeQuestionSetQuestions.find(
      (question) => question.id === selectedEditQuestionId,
    ) ?? null;

  const applyQuestionSummaryToForm = (summary: QuestionBankSummary) => {
    setQuestionFormData({
      ...initialQuestionFormData,
      difficulty: summary.difficulty,
      gameType: summary.gameType,
    });
  };

  const handleOpenCreateQuestionModal = (
    summary?: QuestionBankSummary | null,
  ) => {
    const selectedSummary = summary ??
      questionSummaries[0] ?? {
        difficulty: "Easy" as QuestionBankDifficulty,
        gameType: "Guess the Word" as QuestionBankGameType,
        questionCount: 0,
        questionSetId: null,
      };

    setQuestionFormMode("create");
    setActiveQuestionSummary(selectedSummary);
    applyQuestionSummaryToForm(selectedSummary);
    setQuestionFormError("");
    setSelectedEditQuestionId(null);
    setOpenQuestionFormModal(true);
  };

  const handleCloseQuestionFormModal = () => {
    setOpenQuestionFormModal(false);
    setQuestionFormError("");
    setSelectedEditQuestionId(null);
  };

  const handleOpenEditQuestionModal = (summary: QuestionBankSummary) => {
    const questionSet = questionSets.find(
      (questionSet) =>
        questionSet.game_type === summary.gameType &&
        questionSet.difficulty === summary.difficulty,
    );
    const firstQuestion = questionSet?.questions[0];

    if (!firstQuestion) return;

    setQuestionFormMode("edit");
    setActiveQuestionSummary(summary);
    setSelectedEditQuestionId(firstQuestion.id);
    setQuestionFormData({
      ...getQuestionFormData(firstQuestion),
      difficulty: summary.difficulty,
      gameType: summary.gameType,
    });
    setQuestionFormError("");
    setOpenQuestionFormModal(true);
  };

  const handleSelectEditQuestion = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const questionId = Number(event.target.value);
    const question = activeQuestionSetQuestions.find(
      (activeQuestionSetQuestion) =>
        activeQuestionSetQuestion.id === questionId,
    );

    if (!question || !activeQuestionSummary) return;

    setSelectedEditQuestionId(question.id);
    setQuestionFormData({
      ...getQuestionFormData(question),
      difficulty: activeQuestionSummary.difficulty,
      gameType: activeQuestionSummary.gameType,
    });
  };

  const handleSaveQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
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
    activeQuestionSetQuestions,
    activeQuestionSummary,
    handleCloseQuestionFormModal,
    handleOpenCreateQuestionModal,
    handleOpenEditQuestionModal,
    handleQuestionInput,
    handleSaveQuestion,
    handleSelectEditQuestion,
    isSavingQuestion,
    openQuestionFormModal,
    questionFormData,
    questionFormError,
    questionFormMode,
    selectedEditQuestion,
    selectedEditQuestionId,
  };
};
