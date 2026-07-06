import { useMemo, useState } from "react";
import type { AdminQuestionSet } from "@/features/admin/question-bank/actions/fetch-subject-question-sets.action";
import type { QuestionBankSummary } from "@/features/admin/question-bank/constants/questionBank";

type UseQuestionListModalProps = {
  questionSets: AdminQuestionSet[];
};

export const useQuestionListModal = ({
  questionSets,
}: UseQuestionListModalProps) => {
  const [openQuestionListModal, setOpenQuestionListModal] = useState(false);
  const [activeQuestionSummary, setActiveQuestionSummary] =
    useState<QuestionBankSummary | null>(null);

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

  const handleOpenQuestionListModal = (summary: QuestionBankSummary) => {
    setActiveQuestionSummary(summary);
    setOpenQuestionListModal(true);
  };

  const handleCloseQuestionListModal = () => {
    setOpenQuestionListModal(false);
    setActiveQuestionSummary(null);
  };

  return {
    activeQuestionSetQuestions,
    activeQuestionSummary,
    handleCloseQuestionListModal,
    handleOpenQuestionListModal,
    openQuestionListModal,
  };
};
