import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import type {
  FlashCardDeck,
  FlashCardQuestion,
} from "@/features/app/reviewee/flash-cards/types/flashCard";

type UseEditFlashCardModalProps = {
  flashCardDeck: FlashCardDeck;
  onClose: () => void;
};

const createEmptyQuestion = (): FlashCardQuestion => ({
  id: `new-question-${crypto.randomUUID()}`,
  answer: "",
  question: "",
});

export const useEditFlashCardModal = ({
  flashCardDeck,
  onClose,
}: UseEditFlashCardModalProps) => {
  const [questions, setQuestions] = useState<FlashCardQuestion[]>(
    flashCardDeck.questions,
  );
  const firstQuestionRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    firstQuestionRef.current?.focus();

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) return;

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastFocusableElement
      ) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener("keydown", handleDialogKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const updateQuestion = (
    questionId: string,
    field: "answer" | "question",
    value: string,
  ) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((currentQuestion) =>
        currentQuestion.id === questionId
          ? { ...currentQuestion, [field]: value }
          : currentQuestion,
      ),
    );
  };

  const addQuestion = () => {
    setQuestions((currentQuestions) => [
      ...currentQuestions,
      createEmptyQuestion(),
    ]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((currentQuestions) =>
      currentQuestions.filter(
        (currentQuestion) => currentQuestion.id !== questionId,
      ),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();
  };

  return {
    addQuestion,
    dialogRef,
    firstQuestionRef,
    handleBackdropMouseDown,
    handleSubmit,
    questions,
    removeQuestion,
    updateQuestion,
  };
};
