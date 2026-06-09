import React, { useEffect, useState } from "react";
import {
  fetchSubjectAreas,
  type AdminSubjectArea,
} from "../actions/fetch-subject-areas.action";
import { createSubject } from "../actions/create-subject.action";
import { updateSubjectArea } from "../actions/update-subject-area.action";
import { handleFormChange } from "@/lib/utils";

export const useAdminSubject = () => {
  const [subjectAreas, setSubjectAreas] = useState<AdminSubjectArea[]>([]);
  const [isLoadingSubjectAreas, setIsLoadingSubjectAreas] = useState(true);
  const [subjectAreasError, setSubjectAreasError] = useState("");
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [isUpdatingArea, setIsUpdatingArea] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [subjectFormData, setSubjectFormData] = useState<{
    areaId: string;
    subjectName: string;
  }>({
    areaId: "",
    subjectName: "",
  });
  const [editingAreaId, setEditingAreaId] = useState<number | null>(null);
  const [editingAreaName, setEditingAreaName] = useState("");

  const handleSubjectInput = handleFormChange(
    subjectFormData,
    setSubjectFormData,
  );

  const validateSubjectName = (subjectName: string) => {
    if (!subjectName.trim()) return "Subject name is required";
    if (subjectName.trim().length > 255) {
      return "Subject name must not exceed 255 characters";
    }

    return null;
  };

  const validateAreaName = (areaName: string) => {
    if (!areaName.trim()) return "Area name is required";
    if (areaName.trim().length > 255) {
      return "Area name must not exceed 255 characters";
    }

    return null;
  };

  const loadSubjectAreas = async () => {
    const { success, subjectAreas, error } = await fetchSubjectAreas();

    if (!success) {
      setSubjectAreas([]);
      setSubjectAreasError(error ?? "Unable to fetch subject areas");
    } else {
      setSubjectAreas(subjectAreas);
      setSubjectAreasError("");
    }

    setIsLoadingSubjectAreas(false);
  };

  useEffect(() => {
    loadSubjectAreas();
  }, []);

  const handleOpenAddSubjectModal = (areaId: number) => {
    setSubjectFormData({
      areaId: String(areaId),
      subjectName: "",
    });
    setError("");
  };

  const handleCloseAddSubjectModal = () => {
    setTimeout(() => {
      setSubjectFormData({
        areaId: "",
        subjectName: "",
      });
      setError("");
    }, 300);
  };

  const handleCreateSubject = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

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

      const formDataSubmission = new FormData(e.target);

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

      setSubjectFormData({
        areaId: "",
        subjectName: "",
      });

      setIsLoadingSubjectAreas(true);
      await loadSubjectAreas();

      return {
        success: true,
        message,
      };
    } finally {
      setIsCreatingSubject(false);
    }
  };

  const handleStartAreaEditing = (areaId: number, areaName: string) => {
    setEditingAreaId(areaId);
    setEditingAreaName(areaName);
    setError("");
  };

  const handleCancelAreaEditing = () => {
    setEditingAreaId(null);
    setEditingAreaName("");
    setError("");
  };

  const handleAreaNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingAreaName(e.target.value);
  };

  const handleUpdateArea = async () => {
    if (editingAreaId === null) {
      return {
        success: false,
        message: "",
      };
    }

    try {
      setError("");
      setIsUpdatingArea(true);

      const validationError = validateAreaName(editingAreaName);

      if (validationError) {
        setError(validationError);
        return {
          success: false,
          message: "",
        };
      }

      const formDataSubmission = new FormData();
      formDataSubmission.set("areaId", String(editingAreaId));
      formDataSubmission.set("areaName", editingAreaName.trim());

      const {
        success,
        error: updateSubjectAreaError,
        message,
      } = await updateSubjectArea(formDataSubmission);

      if (!success) {
        setError(updateSubjectAreaError);
        return {
          success: false,
          message: "",
        };
      }

      setEditingAreaId(null);
      setEditingAreaName("");

      setIsLoadingSubjectAreas(true);
      await loadSubjectAreas();

      return {
        success: true,
        message,
      };
    } finally {
      setIsUpdatingArea(false);
    }
  };

  return {
    editingAreaId,
    editingAreaName,
    error,
    handleAreaNameChange,
    handleCancelAreaEditing,
    handleCloseAddSubjectModal,
    handleCreateSubject,
    handleOpenAddSubjectModal,
    handleStartAreaEditing,
    handleSubjectInput,
    handleUpdateArea,
    isCreatingSubject,
    isLoadingSubjectAreas,
    isUpdatingArea,
    subjectAreas,
    subjectAreasError,
    subjectFormData,
  };
};
