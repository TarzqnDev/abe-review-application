import React, { useEffect, useMemo, useState } from "react";
import {
  type AdminSubject,
  fetchSubjectAreas,
  type AdminSubjectArea,
} from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import { updateSubjectArea } from "@/features/app/admin/question-bank/actions/update-subject-area.action";

export type SubjectAreaFilter = "all" | number;

const validateAreaName = (areaName: string) => {
  if (!areaName.trim()) return "Area name is required";
  if (areaName.trim().length > 255) {
    return "Area name must not exceed 255 characters";
  }

  return null;
};

export const useQuestionBank = () => {
  const [subjectAreas, setSubjectAreas] = useState<AdminSubjectArea[]>([]);
  const [isLoadingSubjectAreas, setIsLoadingSubjectAreas] = useState(true);
  const [subjectAreasError, setSubjectAreasError] = useState("");
  const [isUpdatingArea, setIsUpdatingArea] = useState(false);
  const [editingAreaId, setEditingAreaId] = useState<number | null>(null);
  const [editingAreaName, setEditingAreaName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAreaFilter, setActiveAreaFilter] =
    useState<SubjectAreaFilter>("all");
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successBannerMessage, setSuccessBannerMessage] = useState("");
  const [selectedAddSubjectAreaId, setSelectedAddSubjectAreaId] = useState<
    number | null
  >(null);
  const [selectedSubject, setSelectedSubject] = useState<AdminSubject | null>(
    null,
  );

  const showSuccessMessage = (message: string) => {
    setSuccessBannerMessage(message);
    setShowSuccessBanner(true);
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

  const filteredSubjectAreas = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return subjectAreas
      .filter((subjectArea) => {
        if (activeAreaFilter === "all") return true;

        return subjectArea.id === activeAreaFilter;
      })
      .map((subjectArea) => ({
        ...subjectArea,
        subjects: subjectArea.subjects.filter((subject) =>
          subject.name.toLowerCase().includes(normalizedSearchQuery),
        ),
      }))
      .filter((subjectArea) => {
        if (!normalizedSearchQuery) return true;

        return subjectArea.subjects.length > 0;
      });
  }, [activeAreaFilter, searchQuery, subjectAreas]);

  useEffect(() => {
    void Promise.resolve().then(loadSubjectAreas);
  }, []);

  useEffect(() => {
    if (!showSuccessBanner) return;

    const timeout = setTimeout(() => {
      setShowSuccessBanner(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showSuccessBanner]);

  const handleStartAreaEditing = (areaId: number, areaName: string) => {
    setEditingAreaId(areaId);
    setEditingAreaName(areaName);
  };

  const handleCancelAreaEditing = () => {
    setEditingAreaId(null);
    setEditingAreaName("");
  };

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleAreaFilterChange = (areaFilter: SubjectAreaFilter) => {
    setActiveAreaFilter(areaFilter);
  };

  const handleHideSuccessBanner = () => {
    setShowSuccessBanner(false);
  };

  const handleOpenAddSubjectModal = (areaId: number) => {
    setSelectedAddSubjectAreaId(areaId);
  };

  const handleCloseAddSubjectModal = () => {
    setSelectedAddSubjectAreaId(null);
  };

  const handleOpenSubjectDetails = (subject: AdminSubject) => {
    setSelectedSubject(subject);
  };

  const handleCloseSubjectDetails = () => {
    setSelectedSubject(null);
  };

  const handleAreaNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingAreaName(event.target.value);
  };

  const handleUpdateArea = async () => {
    if (editingAreaId === null) {
      return {
        success: false,
        message: "",
      };
    }

    try {
      setIsUpdatingArea(true);

      const validationError = validateAreaName(editingAreaName);

      if (validationError) {
        return {
          success: false,
          message: "",
        };
      }

      const formDataSubmission = new FormData();
      formDataSubmission.set("areaId", String(editingAreaId));
      formDataSubmission.set("areaName", editingAreaName.trim());

      const { success, message } = await updateSubjectArea(formDataSubmission);

      if (!success) {
        return {
          success: false,
          message: "",
        };
      }

      setEditingAreaId(null);
      setEditingAreaName("");

      showSuccessMessage(message);
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
    activeAreaFilter,
    editingAreaId,
    editingAreaName,
    filteredSubjectAreas,
    handleAreaFilterChange,
    handleAreaNameChange,
    handleCancelAreaEditing,
    handleCloseAddSubjectModal,
    handleCloseSubjectDetails,
    handleHideSuccessBanner,
    handleOpenAddSubjectModal,
    handleOpenSubjectDetails,
    handleSearchQueryChange,
    handleStartAreaEditing,
    handleUpdateArea,
    isLoadingSubjectAreas,
    isUpdatingArea,
    searchQuery,
    selectedAddSubjectAreaId,
    selectedSubject,
    showSuccessBanner,
    showSuccessMessage,
    subjectAreas,
    subjectAreasError,
    successBannerMessage,
    loadSubjectAreas,
    setIsLoadingSubjectAreas,
  };
};
