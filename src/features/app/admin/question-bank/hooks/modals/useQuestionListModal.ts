import { useMemo, useState } from "react";
import type {
  AdminQuestion,
  AdminQuestionSet,
} from "@/features/app/admin/question-bank/actions/fetch-subject-question-sets.action";
import type { QuestionBankSummary } from "@/features/app/admin/question-bank/constants/questionBank";
import type { QuestionListModalRequest } from "@/features/app/admin/question-bank/hooks/modals/useSubjectDetailsModal";

type UseQuestionListModalProps = {
  onEditQuestion: (
    summary: QuestionBankSummary,
    question: AdminQuestion,
  ) => void;
  questionSets: AdminQuestionSet[];
  request: QuestionListModalRequest | null;
};

export const useQuestionListModal = ({
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

  const handleCloseQuestionListModal = () => {
    setOpenQuestionListModal(false);
    setActiveQuestionSummary(null);
    setSelectedDeleteQuestion(null);
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

  return {
    activeQuestionSetQuestions,
    activeQuestionSummary,
    handleCloseDeleteConfirmation,
    handleCloseQuestionListModal,
    handleOpenDeleteConfirmation,
    handleOpenEditQuestion,
    openQuestionListModal,
    selectedDeleteQuestion,
  };
};
