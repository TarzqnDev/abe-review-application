import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { createFlashCard } from "@/features/app/reviewee/flash-cards/actions/create-flash-card.action";
import { updateFlashCard } from "@/features/app/reviewee/flash-cards/actions/update-flash-card.action";
import type {
  FlashCard,
  FlashCardDeck,
} from "@/features/app/reviewee/flash-cards/types/flashCard";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export type FlashCardFormModalRequest = {
  areaId: number | null;
  flashCard: FlashCard | null;
  lockArea: boolean;
  mode: "create" | "edit";
  requestId: string;
};

type UseFlashCardFormModalProps = {
  flashCardDecks: FlashCardDeck[];
  loadFlashCardDecks: () => Promise<void>;
  onClose: () => void;
  request: FlashCardFormModalRequest | null;
  showSuccessMessage: (message: string) => void;
};

const getInitialAreaId = (
  request: FlashCardFormModalRequest | null,
  flashCardDecks: FlashCardDeck[],
) => request?.areaId ?? flashCardDecks[0]?.areaId ?? null;

export const useFlashCardFormModal = ({
  flashCardDecks,
  loadFlashCardDecks,
  onClose,
  request,
  showSuccessMessage,
}: UseFlashCardFormModalProps) => {
  const [answer, setAnswer] = useState(request?.flashCard?.answer ?? "");
  const [areaId, setAreaId] = useState<number | null>(() =>
    getInitialAreaId(request, flashCardDecks),
  );
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [question, setQuestion] = useState(request?.flashCard?.question ?? "");
  const dialogRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const onCloseRef = useRef(onClose);

  const isEditMode = request?.mode === "edit";
  const isOpen = request !== null;

  useBodyScrollLock(isOpen);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const focusFrame = requestAnimationFrame(() =>
      questionInputRef.current?.focus(),
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [isOpen]);

  const handleAreaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setAreaId(Number(event.target.value));
  };

  const handleClose = () => {
    if (isSaving) return;

    setFormError("");
    onClose();
  };

  const handleSaveFlashCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const trimmedQuestion = question.trim();
      const trimmedAnswer = answer.trim();

      if (!trimmedQuestion || !trimmedAnswer) {
        setFormError("Question and answer are required");
        return;
      }

      if (!isEditMode && areaId === null) {
        setFormError("A valid area is required");
        return;
      }

      if (isEditMode && !request?.flashCard) {
        setFormError("A valid flash card is required");
        return;
      }

      setFormError("");
      setIsSaving(true);

      const result =
        isEditMode && request.flashCard
          ? await updateFlashCard({
              answer: trimmedAnswer,
              cardId: request.flashCard.id,
              question: trimmedQuestion,
            })
          : await createFlashCard({
              answer: trimmedAnswer,
              areaId: areaId as number,
              question: trimmedQuestion,
            });

      if (!result.success) {
        setFormError(result.error ?? result.message);
        return;
      }

      showSuccessMessage(result.message);
      await loadFlashCardDecks();
      onClose();
    } catch {
      setFormError("Unable to save the flash card. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    answer,
    areaId,
    dialogRef,
    formError,
    handleAreaChange,
    handleClose,
    handleSaveFlashCard,
    isEditMode,
    isOpen,
    isSaving,
    question,
    questionInputRef,
    setAnswer,
    setQuestion,
  };
};
