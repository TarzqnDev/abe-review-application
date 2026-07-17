import { useRef, useState } from "react";
import { exitFlashCardSession } from "@/features/app/reviewee/flash-cards/actions/game/exit-flash-card-session.action";
import type { FlashCardSummary } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";

type UseFlashCardExitGameConfirmationModalOptions = {
  isOpen: boolean;
  onCancel: () => void;
  onExited: (summary: FlashCardSummary) => void;
  sessionId: string;
};

export const useFlashCardExitGameConfirmationModal = ({
  isOpen,
  onCancel,
  onExited,
  sessionId,
}: UseFlashCardExitGameConfirmationModalOptions) => {
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
    const result = await exitFlashCardSession({ sessionId });

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
