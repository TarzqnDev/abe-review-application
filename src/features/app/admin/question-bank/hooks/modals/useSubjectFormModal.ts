import React, { useEffect, useRef, useState } from "react";
import { createSubject } from "@/features/app/admin/question-bank/actions/create-subject.action";
import {
  type AdminSubject,
  type AdminSubjectArea,
} from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import { updateSubject } from "@/features/app/admin/question-bank/actions/update-subject.action";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { handleFormChange } from "@/lib/utils";

type SubjectFormData = {
  areaId: string;
  subjectName: string;
};

type UseSubjectFormModalProps = {
  areaId: number | null;
  loadSubjectAreas: () => Promise<void>;
  onClose: () => void;
  onEditSuccess: () => void;
  setIsLoadingSubjectAreas: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessMessage: (message: string) => void;
  subject: AdminSubject | null;
  subjectAreas: AdminSubjectArea[];
};

const initialSubjectFormData: SubjectFormData = {
  areaId: "",
  subjectName: "",
};

const getInitialSubjectFormData = (
  areaId: number | null,
  subject: AdminSubject | null,
): SubjectFormData => ({
  areaId: String(subject?.area_id ?? areaId ?? ""),
  subjectName: subject?.name ?? "",
});

const validateSubjectName = (subjectName: string) => {
  if (!subjectName.trim()) return "Subject name is required";
  if (subjectName.trim().length > 255) {
    return "Subject name must not exceed 255 characters";
  }

  return null;
};

export const useSubjectFormModal = ({
  areaId,
  loadSubjectAreas,
  onClose,
  onEditSuccess,
  setIsLoadingSubjectAreas,
  showSuccessMessage,
  subject,
  subjectAreas,
}: UseSubjectFormModalProps) => {
  const [isSavingSubject, setIsSavingSubject] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [subjectFormData, setSubjectFormData] = useState<SubjectFormData>(
    getInitialSubjectFormData(areaId, subject),
  );

  const isEditing = subject !== null;
  const openSubjectFormModal = areaId !== null || subject !== null;
  const dialogRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(openSubjectFormModal);

  useEffect(() => {
    if (!openSubjectFormModal) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const focusFrame = requestAnimationFrame(() => dialogRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSavingSubject) {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
  }, [isSavingSubject, onClose, openSubjectFormModal]);

  const handleSubjectInput = handleFormChange(
    subjectFormData,
    setSubjectFormData,
  );

  const handleCloseSubjectFormModal = () => {
    onClose();

    setTimeout(() => {
      setSubjectFormData(initialSubjectFormData);
      setError("");
    }, 300);
  };

  const handleSaveSubject = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault();

      setError("");
      setIsSavingSubject(true);

      const validationError = validateSubjectName(subjectFormData.subjectName);

      if (validationError) {
        setError(validationError);
        return;
      }

      const formDataSubmission = new FormData(event.currentTarget);
      const result = isEditing
        ? await updateSubject(formDataSubmission)
        : await createSubject(formDataSubmission);

      if (!result.success) {
        setError(result.error);
        return;
      }

      showSuccessMessage(result.message);
      if (isEditing) {
        onEditSuccess();
      }
      setIsLoadingSubjectAreas(true);
      await loadSubjectAreas();
      handleCloseSubjectFormModal();
    } finally {
      setIsSavingSubject(false);
    }
  };

  const selectedSubjectArea = subjectAreas.find(
    (subjectArea) => String(subjectArea.id) === subjectFormData.areaId,
  );

  return {
    error,
    dialogRef,
    handleCloseSubjectFormModal,
    handleSaveSubject,
    handleSubjectInput,
    isEditing,
    isSavingSubject,
    openSubjectFormModal,
    selectedSubjectAreaName: selectedSubjectArea?.name ?? "",
    subjectFormData,
  };
};
