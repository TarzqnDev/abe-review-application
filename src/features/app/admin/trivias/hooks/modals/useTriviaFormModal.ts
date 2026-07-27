import { useEffect, useRef, useState, type FormEvent } from "react";
import { createTrivia } from "@/features/app/admin/trivias/actions/create-trivia.action";
import { updateTrivia } from "@/features/app/admin/trivias/actions/update-trivia.action";
import type { TriviaFormModalRequest } from "@/features/app/admin/trivias/types/adminTrivia";
import { getLocalDateValue } from "@/features/app/admin/trivias/utils/adminTriviaDates";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type UseTriviaFormModalProps = {
  closeWithAnimation: (onClosed: () => void) => void;
  isDeleteConfirmationOpen: boolean;
  loadTrivias: () => Promise<void>;
  onClose: () => void;
  request: TriviaFormModalRequest | null;
  showSuccessMessage: (message: string) => void;
};

export const useTriviaFormModal = ({
  closeWithAnimation,
  isDeleteConfirmationOpen,
  loadTrivias,
  onClose,
  request,
  showSuccessMessage,
}: UseTriviaFormModalProps) => {
  const [content, setContent] = useState(request?.trivia?.content ?? "");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [publishDate, setPublishDate] = useState(
    request?.trivia?.publishDate ?? request?.initialPublishDate ?? "",
  );
  const closeWithAnimationRef = useRef(closeWithAnimation);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const isEditMode = request?.mode === "edit";
  const isOpen = request !== null;
  const originalPublishDate = request?.trivia?.publishDate ?? "";
  const todayDate = getLocalDateValue();

  useBodyScrollLock(isOpen);

  useEffect(() => {
    closeWithAnimationRef.current = closeWithAnimation;
    onCloseRef.current = onClose;
  }, [closeWithAnimation, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const focusFrame = requestAnimationFrame(() =>
      contentInputRef.current?.focus(),
    );

    return () => {
      cancelAnimationFrame(focusFrame);
      previouslyFocusedElement?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !isSaving &&
        !isDeleteConfirmationOpen
      ) {
        closeWithAnimationRef.current(onCloseRef.current);
        return;
      }

      if (event.key !== "Tab" || isDeleteConfirmationOpen) return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isDeleteConfirmationOpen,
    isOpen,
    isSaving,
  ]);

  const handleClose = () => {
    if (isSaving) return;
    closeWithAnimationRef.current(onCloseRef.current);
  };

  const handleSaveTrivia = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = content.trim();
    const isUnchangedEditDate =
      isEditMode && publishDate === originalPublishDate;

    if (!trimmedContent || !publishDate) {
      setFormError("Trivia content and publish date are required.");
      return;
    }

    if (!isUnchangedEditDate && publishDate < todayDate) {
      setFormError("Publish date cannot be earlier than today.");
      return;
    }

    if (isEditMode && !request?.trivia) {
      setFormError("A valid trivia is required.");
      return;
    }

    try {
      setFormError("");
      setIsSaving(true);

      const result =
        isEditMode && request.trivia
          ? await updateTrivia({
              content: trimmedContent,
              publishDate,
              triviaId: request.trivia.id,
            })
          : await createTrivia({ content: trimmedContent, publishDate });

      if (!result.success) {
        setFormError(result.error ?? result.message);
        return;
      }

      await loadTrivias();
      showSuccessMessage(result.message);
      closeWithAnimationRef.current(onCloseRef.current);
    } catch {
      setFormError("Unable to save the trivia. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    content,
    contentInputRef,
    dialogRef,
    formError,
    handleClose,
    handleSaveTrivia,
    isEditMode,
    isSaving,
    originalPublishDate,
    publishDate,
    setContent,
    setPublishDate,
    todayDate,
  };
};
