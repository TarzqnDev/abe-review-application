import { useRef, useState } from "react";
import { exitQuizSession } from "@/features/app/reviewee/mcq-quiz/actions/exit-quiz-session.action";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";
import type { QuizSummary } from "@/features/app/reviewee/mcq-quiz/types/quiz";

type UseExitGameConfirmationModalOptions = {
  isOpen: boolean;
  onCancel: () => void;
  onExited: (summary: QuizSummary) => void;
  sessionId: string;
};

export const useExitGameConfirmationModal = ({
  isOpen,
  onCancel,
  onExited,
  sessionId,
}: UseExitGameConfirmationModalOptions) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [error, setError] = useState("");
  const modalAccessibility = useQuizModalAccessibility({
    initialFocusRef: cancelButtonRef,
    isOpen,
    onClose: isExiting ? undefined : onCancel,
  });

  const handleExit = async () => {
    if (isExiting) return;

    setIsExiting(true);
    setError("");
    const result = await exitQuizSession({ sessionId });

    if (!result.success || !result.summary) {
      setError(result.error ?? "Unable to end the game.");
      setIsExiting(false);
      return;
    }

    onExited(result.summary);
    setIsExiting(false);
  };

  return {
    cancelButtonRef,
    error,
    handleExit,
    isExiting,
    modalAccessibility,
  };
};
