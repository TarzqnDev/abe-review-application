import { useEffect, useRef, useState, type FormEvent } from "react";
import { deleteTrivia } from "@/features/app/admin/trivias/actions/delete-trivia.action";
import type { AdminTrivia } from "@/features/app/admin/trivias/types/adminTrivia";

type UseDeleteTriviaConfirmationModalProps = {
  loadTrivias: () => Promise<void>;
  onClose: () => void;
  onDeleted: () => void;
  showSuccessMessage: (message: string) => void;
  trivia: AdminTrivia | null;
};

export const useDeleteTriviaConfirmationModal = ({
  loadTrivias,
  onClose,
  onDeleted,
  showSuccessMessage,
  trivia,
}: UseDeleteTriviaConfirmationModalProps) => {
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!trivia) return;

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
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
  }, [isDeleting, onClose, trivia]);

  const handleDeleteTrivia = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trivia) {
      setDeleteError("A valid trivia is required.");
      return;
    }

    try {
      setDeleteError("");
      setIsDeleting(true);
      const result = await deleteTrivia({ triviaId: trivia.id });

      if (!result.success) {
        setDeleteError(result.error ?? result.message);
        return;
      }

      await loadTrivias();
      showSuccessMessage(result.message);
      onDeleted();
    } catch {
      setDeleteError("Unable to delete the trivia. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    cancelButtonRef,
    deleteError,
    dialogRef,
    handleDeleteTrivia,
    isDeleting,
  };
};
