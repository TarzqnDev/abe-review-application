import React, { useMemo, useState } from "react";
import type {
  AdminQuestion,
  AdminQuestionSet,
} from "@/features/app/admin/question-bank/actions/fetch-subject-question-sets.action";
import type { QuestionBankSummary } from "@/features/app/admin/question-bank/constants/questionBank";
import type { QuestionListModalRequest } from "@/features/app/admin/question-bank/hooks/modals/useSubjectDetailsModal";

type UseQuestionListModalProps = {
  onAddQuestion: (summary: QuestionBankSummary) => void;
  onEditQuestion: (
    summary: QuestionBankSummary,
    question: AdminQuestion,
  ) => void;
  questionSets: AdminQuestionSet[];
  request: QuestionListModalRequest | null;
};

const QUESTIONS_PER_PAGE = 5;

export const useQuestionListModal = ({
  onAddQuestion,
  onEditQuestion,
  questionSets,
  request,
}: UseQuestionListModalProps) => {
  const [openQuestionListModal, setOpenQuestionListModal] = useState(
    request !== null,
  );
  const [activeQuestionSummary, setActiveQuestionSummary] =
    useState<QuestionBankSummary | null>(request?.summary ?? null);
  const [selectedDeleteQuestion, setSelectedDeleteQuestion] =
    useState<AdminQuestion | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const activeQuestionSetQuestions = useMemo(
    () => activeQuestionSet?.questions ?? [],
    [activeQuestionSet],
  );

  const filteredQuestions = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();

    if (!normalizedSearchQuery) return activeQuestionSetQuestions;

    return activeQuestionSetQuestions.filter(
      (question) =>
        question.question_text
          .toLocaleLowerCase()
          .includes(normalizedSearchQuery) ||
        question.question_options.some((option) =>
          option.option_text
            .toLocaleLowerCase()
            .includes(normalizedSearchQuery),
        ),
    );
  }, [activeQuestionSetQuestions, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const firstQuestionIndex = (safeCurrentPage - 1) * QUESTIONS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(
    firstQuestionIndex,
    firstQuestionIndex + QUESTIONS_PER_PAGE,
  );
  const firstQuestionNumber = filteredQuestions.length
    ? firstQuestionIndex + 1
    : 0;
  const lastQuestionNumber = Math.min(
    firstQuestionIndex + QUESTIONS_PER_PAGE,
    filteredQuestions.length,
  );

  const handleCloseQuestionListModal = () => {
    setOpenQuestionListModal(false);
    setActiveQuestionSummary(null);
    setSelectedDeleteQuestion(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleAddQuestion = () => {
    if (!activeQuestionSummary) return;

    onAddQuestion(activeQuestionSummary);
  };

  const handleOpenEditQuestion = (question: AdminQuestion) => {
    if (!activeQuestionSummary) return;

    onEditQuestion(activeQuestionSummary, question);
  };

  const handleOpenDeleteConfirmation = (question: AdminQuestion) => {
    setSelectedDeleteQuestion(question);
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedDeleteQuestion(null);
  };

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return {
    activeQuestionSetQuestions,
    activeQuestionSummary,
    currentPage: safeCurrentPage,
    filteredQuestionCount: filteredQuestions.length,
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
  };
};
