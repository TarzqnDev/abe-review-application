import React, { useState } from "react";
import { createPaesQuestion } from "@/features/app/admin/question-bank/actions/create-paes-question.action";
import type { AdminSubject } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import type { AdminQuestion } from "@/features/app/admin/question-bank/actions/fetch-subject-question-sets.action";
import { updatePaesQuestion } from "@/features/app/admin/question-bank/actions/update-paes-question.action";
import { MODAL_ANIMATION_DURATION_MS } from "@/hooks/useModalAnimation";
import { handleFormChange } from "@/lib/utils";

export type PaesQuestionFormRequest = {
  mode: "create" | "edit";
  question?: AdminQuestion | null;
  requestId: number;
  subject?: AdminSubject | null;
};

type PaesQuestionFormData = {
  correctOptionSortOrder: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  questionText: string;
  subjectId: string;
};

type UsePaesQuestionFormModalProps = {
  onClose: () => void;
  onSaved?: (subjectId: number) => Promise<void>;
  request: PaesQuestionFormRequest | null;
  subjects: AdminSubject[];
  showSuccessMessage: (message: string) => void;
};

const getInitialFormData = (
  request: PaesQuestionFormRequest | null,
  subjects: AdminSubject[],
): PaesQuestionFormData => {
  const question = request?.question;
  const correctOption = question?.question_options.find(
    (option) => option.is_correct,
  );

  return {
    correctOptionSortOrder: correctOption
      ? String(correctOption.sort_order)
      : "",
    option1: question?.question_options[0]?.option_text ?? "",
    option2: question?.question_options[1]?.option_text ?? "",
    option3: question?.question_options[2]?.option_text ?? "",
    option4: question?.question_options[3]?.option_text ?? "",
    questionText: question?.question_text ?? "",
    subjectId: String(request?.subject?.id ?? subjects[0]?.id ?? ""),
  };
};

export const usePaesQuestionFormModal = ({
  onClose,
  onSaved,
  request,
  subjects,
  showSuccessMessage,
}: UsePaesQuestionFormModalProps) => {
  const [openPaesQuestionFormModal, setOpenPaesQuestionFormModal] = useState(
    request !== null,
  );
  const [questionFormData, setQuestionFormData] =
    useState<PaesQuestionFormData>(() => getInitialFormData(request, subjects));
  const [questionFormError, setQuestionFormError] = useState("");
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const questionFormMode = request?.mode ?? "create";
  const selectedEditQuestion = request?.question ?? null;

  const handleQuestionInput = handleFormChange(
    questionFormData,
    setQuestionFormData,
  );

  const handleClosePaesQuestionFormModal = () => {
    setOpenPaesQuestionFormModal(false);
    setQuestionFormError("");
    onClose();
  };

  const handleSaveQuestion = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault();
      setQuestionFormError("");
      setIsSavingQuestion(true);

      const formDataSubmission = new FormData(event.currentTarget);
      const result =
        questionFormMode === "edit"
          ? await updatePaesQuestion(formDataSubmission)
          : await createPaesQuestion(formDataSubmission);

      if (!result.success) {
        setQuestionFormError(result.error ?? result.message);
        return;
      }

      const savedSubjectId = Number(formDataSubmission.get("subjectId"));

      showSuccessMessage(result.message);

      if (questionFormMode === "edit") {
        setOpenPaesQuestionFormModal(false);
        window.setTimeout(onClose, MODAL_ANIMATION_DURATION_MS);
      } else {
        setQuestionFormData((currentFormData) => ({
          ...currentFormData,
          correctOptionSortOrder: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          questionText: "",
        }));
      }

      if (onSaved) {
        await onSaved(savedSubjectId);
      }
    } finally {
      setIsSavingQuestion(false);
    }
  };

  return {
    handleClosePaesQuestionFormModal,
    handleQuestionInput,
    handleSaveQuestion,
    isSavingQuestion,
    openPaesQuestionFormModal,
    questionFormData,
    questionFormError,
    questionFormMode,
    selectedEditQuestion,
  };
};
