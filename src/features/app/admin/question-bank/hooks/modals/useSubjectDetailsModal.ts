import { useEffect, useMemo, useState } from "react";
import type { AdminSubject } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import {
  type AdminQuestion,
  fetchSubjectQuestionSets,
  type AdminQuestionSet,
} from "@/features/app/admin/question-bank/actions/fetch-subject-question-sets.action";
import {
  createEmptyQuestionBankSummaries,
  QUESTION_BANK_DIFFICULTIES,
  type QuestionBankSummary,
} from "@/features/app/admin/question-bank/constants/questionBank";

export type QuestionFormModalRequest = {
  mode: "create" | "edit";
  questionId?: number | null;
  requestId: number;
  summary?: QuestionBankSummary | null;
};

export type QuestionListModalRequest = {
  requestId: number;
  summary: QuestionBankSummary;
};

type UseSubjectDetailsModalProps = {
  onClose: () => void;
  subject: AdminSubject | null;
};

export const useSubjectDetailsModal = ({
  onClose,
  subject,
}: UseSubjectDetailsModalProps) => {
  const [questionSets, setQuestionSets] = useState<AdminQuestionSet[]>([]);
  const [questionSummaries, setQuestionSummaries] = useState<
    QuestionBankSummary[]
  >(createEmptyQuestionBankSummaries());
  const [isLoadingQuestionSets, setIsLoadingQuestionSets] = useState(false);
  const [questionSetsError, setQuestionSetsError] = useState("");
  const [questionFormRequest, setQuestionFormRequest] =
    useState<QuestionFormModalRequest | null>(null);
  const [questionListRequest, setQuestionListRequest] =
    useState<QuestionListModalRequest | null>(null);

  const selectedSubjectSummaries = subject
    ? questionSummaries
    : createEmptyQuestionBankSummaries();

  const selectedSubjectTotalQuestions = selectedSubjectSummaries.reduce(
    (totalQuestions, summary) => totalQuestions + summary.questionCount,
    0,
  );

  const selectedSubjectSummariesByDifficulty = QUESTION_BANK_DIFFICULTIES.map(
    (difficulty) => ({
      difficulty,
      summaries: selectedSubjectSummaries.filter(
        (summary) => summary.difficulty === difficulty,
      ),
    }),
  );

  const loadSubjectQuestions = async (subjectId: number) => {
    setIsLoadingQuestionSets(true);
    setQuestionSetsError("");

    const { success, questionSets, summaries, error } =
      await fetchSubjectQuestionSets(subjectId);

    if (!success) {
      setQuestionSets([]);
      setQuestionSummaries(createEmptyQuestionBankSummaries());
      setQuestionSetsError(error ?? "Unable to fetch subject questions");
    } else {
      setQuestionSets(questionSets);
      setQuestionSummaries(summaries);
      setQuestionSetsError("");
    }

    setIsLoadingQuestionSets(false);
  };

  useEffect(() => {
    if (!subject) return;

    void Promise.resolve().then(() => loadSubjectQuestions(subject.id));
  }, [subject]);

  const handleCloseSubjectDetails = () => {
    onClose();
    setQuestionSets([]);
    setQuestionSummaries(createEmptyQuestionBankSummaries());
    setQuestionSetsError("");
    setQuestionFormRequest(null);
    setQuestionListRequest(null);
  };

  const handleOpenCreateQuestionModal = (
    summary?: QuestionBankSummary | null,
  ) => {
    setQuestionFormRequest({
      mode: "create",
      requestId: Date.now(),
      summary,
    });
  };

  const handleOpenEditQuestionModal = (
    summary: QuestionBankSummary,
    question: AdminQuestion,
  ) => {
    setQuestionFormRequest({
      mode: "edit",
      questionId: question.id,
      requestId: Date.now(),
      summary,
    });
  };

  const handleOpenQuestionListModal = (summary: QuestionBankSummary) => {
    setQuestionListRequest({
      requestId: Date.now(),
      summary,
    });
  };

  const handleCloseQuestionFormModal = () => {
    setQuestionFormRequest(null);
  };

  const handleCloseQuestionListModal = () => {
    setQuestionListRequest(null);
  };

  const activeSubjectQuestionSets = useMemo(
    () => questionSets,
    [questionSets],
  );

  return {
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
  };
};
