import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { deleteSubject } from "@/features/app/admin/question-bank/actions/delete-subject.action";
import type { AdminSubject } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type UseDeleteSubjectConfirmationModalProps = {
  loadSubjectAreas: () => Promise<void>;
  onClose: () => void;
  onDeleteSuccess: () => void;
  showSuccessMessage: (message: string) => void;
  subject: AdminSubject | null;
};

export const useDeleteSubjectConfirmationModal = ({
  loadSubjectAreas,
  onClose,
  onDeleteSuccess,
  showSuccessMessage,
  subject,
}: UseDeleteSubjectConfirmationModalProps) => {
  const [deleteError, setDeleteError] = useState("");
  const [deleteErrorSubjectId, setDeleteErrorSubjectId] = useState<
    number | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLFormElement>(null);

  useBodyScrollLock(subject !== null);

  const handleCloseDeleteSubjectConfirmation = useCallback(() => {
    setDeleteError("");
    setDeleteErrorSubjectId(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!subject) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const focusFrame = requestAnimationFrame(() =>
      cancelButtonRef.current?.focus(),
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        handleCloseDeleteSubjectConfirmation();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) return;

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

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
  }, [handleCloseDeleteSubjectConfirmation, isDeleting, subject]);

  const handleDeleteSubject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!subject) {
      setDeleteError("A valid subject is required.");
      setDeleteErrorSubjectId(null);
      return;
    }

    try {
      setDeleteError("");
      setIsDeleting(true);
      const result = await deleteSubject({
        areaId: subject.area_id,
        subjectId: subject.id,
      });

      if (!result.success) {
        setDeleteError(result.error ?? result.message);
        setDeleteErrorSubjectId(subject.id);
        return;
      }

      onDeleteSuccess();
      await loadSubjectAreas();
      showSuccessMessage(result.message);
      handleCloseDeleteSubjectConfirmation();
    } catch {
      setDeleteError("Unable to delete the subject. Please try again.");
      setDeleteErrorSubjectId(subject.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    cancelButtonRef,
    deleteError:
      subject && deleteErrorSubjectId === subject.id ? deleteError : "",
    dialogRef,
    handleCloseDeleteSubjectConfirmation,
    handleDeleteSubject,
    isDeleting,
  };
};
