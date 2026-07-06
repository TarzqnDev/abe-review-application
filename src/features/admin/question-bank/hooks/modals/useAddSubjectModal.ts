import React, { useState } from "react";
import {
  type AdminSubjectArea,
} from "@/features/admin/question-bank/actions/fetch-subject-areas.action";
import { createSubject } from "@/features/admin/question-bank/actions/create-subject.action";
import { handleFormChange } from "@/lib/utils";

type SubjectFormData = {
  areaId: string;
  subjectName: string;
};

type UseAddSubjectModalProps = {
  loadSubjectAreas: () => Promise<void>;
  setIsLoadingSubjectAreas: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessMessage: (message: string) => void;
};

const initialSubjectFormData: SubjectFormData = {
  areaId: "",
  subjectName: "",
};

const validateSubjectName = (subjectName: string) => {
  if (!subjectName.trim()) return "Subject name is required";
  if (subjectName.trim().length > 255) {
    return "Subject name must not exceed 255 characters";
  }

  return null;
};

export const useAddSubjectModal = ({
  loadSubjectAreas,
  setIsLoadingSubjectAreas,
  showSuccessMessage,
}: UseAddSubjectModalProps) => {
  const [openAddSubjectModal, setOpenAddSubjectModal] = useState(false);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [subjectFormData, setSubjectFormData] = useState<SubjectFormData>(
    initialSubjectFormData,
  );

  const handleSubjectInput = handleFormChange(
    subjectFormData,
    setSubjectFormData,
  );

  const handleOpenAddSubjectModal = (areaId: number) => {
    setSubjectFormData({
      areaId: String(areaId),
      subjectName: "",
    });
    setError("");
    setOpenAddSubjectModal(true);
  };

  const handleCloseAddSubjectModal = () => {
    setOpenAddSubjectModal(false);

    setTimeout(() => {
      setSubjectFormData(initialSubjectFormData);
      setError("");
    }, 300);
  };

  const handleCreateSubject = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError("");
      setIsCreatingSubject(true);

      const validationError = validateSubjectName(subjectFormData.subjectName);

      if (validationError) {
        setError(validationError);
        return {
          success: false,
          message: "",
        };
      }

      const formDataSubmission = new FormData(event.currentTarget);

      const {
        success,
        error: createSubjectError,
        message,
      } = await createSubject(formDataSubmission);

      if (!success) {
        setError(createSubjectError);
        return {
          success: false,
          message: "",
        };
      }

      setSubjectFormData(initialSubjectFormData);

      showSuccessMessage(message);
      setIsLoadingSubjectAreas(true);
      await loadSubjectAreas();
      handleCloseAddSubjectModal();

      return {
        success: true,
        message,
      };
    } finally {
      setIsCreatingSubject(false);
    }
  };

  const selectedSubjectAreaName = (
    subjectAreas: AdminSubjectArea[],
  ) => {
    const selectedSubjectArea = subjectAreas.find(
      (subjectArea) => String(subjectArea.id) === subjectFormData.areaId,
    );

    return selectedSubjectArea?.name ?? "";
  };

  return {
    error,
    handleCloseAddSubjectModal,
    handleCreateSubject,
    handleOpenAddSubjectModal,
    handleSubjectInput,
    isCreatingSubject,
    openAddSubjectModal,
    selectedSubjectAreaName,
    subjectFormData,
  };
};
