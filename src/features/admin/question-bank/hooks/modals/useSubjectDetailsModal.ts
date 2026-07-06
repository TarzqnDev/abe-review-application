import { useMemo, useState } from "react";
import type { AdminSubject } from "@/features/admin/question-bank/actions/fetch-subject-areas.action";
import {
  fetchSubjectQuestionSets,
  type AdminQuestionSet,
} from "@/features/admin/question-bank/actions/fetch-subject-question-sets.action";
import {
  createEmptyQuestionBankSummaries,
  QUESTION_BANK_DIFFICULTIES,
  type QuestionBankSummary,
} from "@/features/admin/question-bank/constants/questionBank";

export const useSubjectDetailsModal = () => {
  const [selectedSubject, setSelectedSubject] = useState<AdminSubject | null>(
    null,
  );
  const [questionSets, setQuestionSets] = useState<AdminQuestionSet[]>([]);
  const [questionSummaries, setQuestionSummaries] = useState<
    QuestionBankSummary[]
  >(createEmptyQuestionBankSummaries());
  const [isLoadingQuestionSets, setIsLoadingQuestionSets] = useState(false);
  const [questionSetsError, setQuestionSetsError] = useState("");

  const selectedSubjectSummaries = selectedSubject
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

  const handleOpenSubjectDetails = (subject: AdminSubject) => {
    setSelectedSubject(subject);
    void loadSubjectQuestions(subject.id);
  };

  const handleCloseSubjectDetails = () => {
    setSelectedSubject(null);
    setQuestionSets([]);
    setQuestionSummaries(createEmptyQuestionBankSummaries());
    setQuestionSetsError("");
  };

  const activeSubjectQuestionSets = useMemo(
    () => questionSets,
    [questionSets],
  );

  return {
    activeSubjectQuestionSets,
    handleCloseSubjectDetails,
    handleOpenSubjectDetails,
    isLoadingQuestionSets,
    loadSubjectQuestions,
    questionSetsError,
    questionSummaries,
    selectedSubject,
    selectedSubjectSummariesByDifficulty,
    selectedSubjectTotalQuestions,
  };
};
