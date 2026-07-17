import { useEffect, useRef, useState, type FormEvent } from "react";
import { deleteFlashCard } from "@/features/app/reviewee/flash-cards/actions/delete-flash-card.action";
import type { FlashCard } from "@/features/app/reviewee/flash-cards/types/flashCard";

type UseDeleteFlashCardConfirmationModalProps = {
  flashCard: FlashCard | null;
  loadFlashCardDecks: () => Promise<void>;
  onClose: () => void;
  showSuccessMessage: (message: string) => void;
};

export const useDeleteFlashCardConfirmationModal = ({
  flashCard,
  loadFlashCardDecks,
  onClose,
  showSuccessMessage,
}: UseDeleteFlashCardConfirmationModalProps) => {
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!flashCard) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const focusFrame = requestAnimationFrame(() =>
      cancelButtonRef.current?.focus(),
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        onClose();
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
  }, [flashCard, isDeleting, onClose]);

  const handleDeleteFlashCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!flashCard) {
        setDeleteError("A valid flash card is required");
        return;
      }

      setDeleteError("");
      setIsDeleting(true);

      const result = await deleteFlashCard({ cardId: flashCard.id });

      if (!result.success) {
        setDeleteError(result.error ?? result.message);
        return;
      }

      showSuccessMessage(result.message);
      await loadFlashCardDecks();
      onClose();
    } catch {
      setDeleteError("Unable to delete the flash card. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    cancelButtonRef,
    deleteError,
    handleDeleteFlashCard,
    dialogRef,
    isDeleting,
  };
};
