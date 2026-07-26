import React, { useEffect, useMemo, useState } from "react";
import type { AdminSubject } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import { fetchPaesSubjectQuestions } from "@/features/app/admin/question-bank/actions/fetch-paes-subject-questions.action";
import type { AdminQuestion } from "@/features/app/admin/question-bank/actions/fetch-subject-question-sets.action";
import type { PaesQuestionFormRequest } from "@/features/app/admin/question-bank/hooks/modals/usePaesQuestionFormModal";

type UsePaesQuestionListModalProps = {
  onClose: () => void;
  subject: AdminSubject | null;
};

const QUESTIONS_PER_PAGE = 5;

export const usePaesQuestionListModal = ({
  onClose,
  subject,
}: UsePaesQuestionListModalProps) => {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [questionFormRequest, setQuestionFormRequest] =
    useState<PaesQuestionFormRequest | null>(null);
  const [selectedDeleteQuestion, setSelectedDeleteQuestion] =
    useState<AdminQuestion | null>(null);

  const loadPaesSubjectQuestions = async (subjectId: number) => {
    setIsLoadingQuestions(true);
    setQuestionsError("");

    const result = await fetchPaesSubjectQuestions(subjectId);

    if (!result.success) {
      setQuestions([]);
      setQuestionsError(result.error ?? "Unable to fetch PAES questions");
    } else {
      setQuestions(result.questions);
    }

    setIsLoadingQuestions(false);
  };

  useEffect(() => {
    if (!subject) return;

    void Promise.resolve().then(() => loadPaesSubjectQuestions(subject.id));
  }, [subject]);

  const filteredQuestions = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();

    if (!normalizedSearchQuery) return questions;

    return questions.filter(
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
  }, [questions, searchQuery]);

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

  const handleCloseQuestionListModal = () => {
    setSearchQuery("");
    setCurrentPage(1);
    setQuestionFormRequest(null);
    setSelectedDeleteQuestion(null);
    onClose();
  };

  const handleOpenCreateQuestionModal = () => {
    setQuestionFormRequest({
      mode: "create",
      requestId: Date.now(),
      subject,
    });
  };

  const handleOpenEditQuestionModal = (question: AdminQuestion) => {
    setQuestionFormRequest({
      mode: "edit",
      question,
      requestId: Date.now(),
      subject,
    });
  };

  const handleCloseQuestionFormModal = () => {
    setQuestionFormRequest(null);
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
    currentPage: safeCurrentPage,
    filteredQuestionCount: filteredQuestions.length,
    firstQuestionNumber: filteredQuestions.length
      ? firstQuestionIndex + 1
      : 0,
    handleCloseDeleteConfirmation,
    handleCloseQuestionFormModal,
    handleCloseQuestionListModal,
    handleOpenCreateQuestionModal,
    handleOpenDeleteConfirmation,
    handleOpenEditQuestionModal,
    handlePageChange,
    handleSearchQueryChange,
    isLoadingQuestions,
    lastQuestionNumber: Math.min(
      firstQuestionIndex + QUESTIONS_PER_PAGE,
      filteredQuestions.length,
    ),
    loadPaesSubjectQuestions,
    paginatedQuestions,
    questionFormRequest,
    questions,
    questionsError,
    searchQuery,
    selectedDeleteQuestion,
    totalPages,
  };
};
