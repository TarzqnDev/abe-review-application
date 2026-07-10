import React, { useState } from "react";
import { deleteQuestion } from "@/features/app/admin/question-bank/actions/delete-question.action";
import type { AdminQuestion } from "@/features/app/admin/question-bank/actions/fetch-subject-question-sets.action";
import type { AdminSubject } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";

type UseDeleteQuestionConfirmationModalProps = {
  loadSubjectQuestions: (subjectId: number) => Promise<void>;
  onClose: () => void;
  question: AdminQuestion | null;
  selectedSubject: AdminSubject | null;
  showSuccessMessage: (message: string) => void;
};

export const useDeleteQuestionConfirmationModal = ({
  loadSubjectQuestions,
  onClose,
  question,
  selectedSubject,
  showSuccessMessage,
}: UseDeleteQuestionConfirmationModalProps) => {
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);
  const [deleteQuestionError, setDeleteQuestionError] = useState("");

  const handleDeleteQuestion = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault();

      if (!question || !selectedSubject) {
        setDeleteQuestionError("A valid question is required");
        return;
      }

      setDeleteQuestionError("");
      setIsDeletingQuestion(true);

      const formDataSubmission = new FormData(event.currentTarget);
      const result = await deleteQuestion(formDataSubmission);

      if (!result.success) {
        setDeleteQuestionError(result.error ?? result.message);
        return;
      }

      showSuccessMessage(result.message);
      onClose();
      await loadSubjectQuestions(selectedSubject.id);
    } finally {
      setIsDeletingQuestion(false);
    }
  };

  return {
    deleteQuestionError,
    handleDeleteQuestion,
    isDeletingQuestion,
  };
};
