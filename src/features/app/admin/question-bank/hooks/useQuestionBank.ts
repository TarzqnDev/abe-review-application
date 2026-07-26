import React, { useEffect, useMemo, useState } from "react";
import {
  type AdminSubject,
  fetchSubjectAreas,
  type AdminSubjectArea,
} from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import { updateSubjectArea } from "@/features/app/admin/question-bank/actions/update-subject-area.action";
import type { SubjectAreaMode } from "@/features/app/admin/question-bank/components/SubjectAreaSection";
import { isPaesSubjectArea } from "@/features/app/admin/question-bank/constants/questionBank";
import type { PaesQuestionFormRequest } from "@/features/app/admin/question-bank/hooks/modals/usePaesQuestionFormModal";

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
  const [selectedEditSubject, setSelectedEditSubject] =
    useState<AdminSubject | null>(null);
  const [selectedSubjectToDelete, setSelectedSubjectToDelete] =
    useState<AdminSubject | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<AdminSubject | null>(
    null,
  );
  const [selectedPaesSubject, setSelectedPaesSubject] =
    useState<AdminSubject | null>(null);
  const [paesQuestionFormRequest, setPaesQuestionFormRequest] =
    useState<PaesQuestionFormRequest | null>(null);
  const [subjectAreaModes, setSubjectAreaModes] = useState<
    Record<number, Exclude<SubjectAreaMode, null>>
  >({});

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
    const selectedArea = subjectAreas.find(
      (subjectArea) => subjectArea.id === areaId,
    );

    if (selectedArea && isPaesSubjectArea(selectedArea.name)) {
      return;
    }

    setSelectedAddSubjectAreaId(areaId);
  };

  const handleOpenAddPaesQuestionModal = () => {
    setPaesQuestionFormRequest({
      mode: "create",
      requestId: Date.now(),
    });
  };

  const handleClosePaesQuestionFormModal = () => {
    setPaesQuestionFormRequest(null);
  };

  const handleCloseAddSubjectModal = () => {
    setSelectedAddSubjectAreaId(null);
  };

  const handleCloseSubjectFormModal = () => {
    setSelectedAddSubjectAreaId(null);
    setSelectedEditSubject(null);
  };

  const handleSubjectAreaModeChange = (
    areaId: number,
    mode: SubjectAreaMode,
  ) => {
    const selectedArea = subjectAreas.find(
      (subjectArea) => subjectArea.id === areaId,
    );

    if (selectedArea && isPaesSubjectArea(selectedArea.name)) {
      return;
    }

    setSubjectAreaModes(() => {
      if (mode === null) {
        return {};
      }

      return {
        [areaId]: mode,
      };
    });
  };

  const handleSubjectModeOperationSuccess = () => {
    setSubjectAreaModes({});
  };

  const handleSelectSubject = (
    subject: AdminSubject,
    mode: SubjectAreaMode,
  ) => {
    const selectedArea = subjectAreas.find(
      (subjectArea) => subjectArea.id === subject.area_id,
    );

    if (selectedArea && isPaesSubjectArea(selectedArea.name)) {
      setSubjectAreaModes({});
      setSelectedPaesSubject(subject);
      return;
    }

    if (mode === "edit") {
      setSelectedEditSubject(subject);
      return;
    }

    if (mode === "remove") {
      setSelectedSubjectToDelete(subject);
      return;
    }

    setSubjectAreaModes({});
    setSelectedSubject(subject);
  };

  const handleCloseSubjectDetails = () => {
    setSelectedSubject(null);
  };

  const handleClosePaesQuestionList = () => {
    setSelectedPaesSubject(null);
  };

  const handleCloseDeleteSubjectConfirmation = () => {
    setSelectedSubjectToDelete(null);
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
    handleCloseDeleteSubjectConfirmation,
    handleClosePaesQuestionFormModal,
    handleClosePaesQuestionList,
    handleCloseSubjectFormModal,
    handleCloseSubjectDetails,
    handleHideSuccessBanner,
    handleOpenAddSubjectModal,
    handleOpenAddPaesQuestionModal,
    handleSearchQueryChange,
    handleSelectSubject,
    handleStartAreaEditing,
    handleSubjectAreaModeChange,
    handleSubjectModeOperationSuccess,
    handleUpdateArea,
    isLoadingSubjectAreas,
    isUpdatingArea,
    searchQuery,
    paesQuestionFormRequest,
    selectedAddSubjectAreaId,
    selectedEditSubject,
    selectedSubject,
    selectedPaesSubject,
    selectedSubjectToDelete,
    showSuccessBanner,
    showSuccessMessage,
    subjectAreas,
    subjectAreaModes,
    subjectAreasError,
    successBannerMessage,
    loadSubjectAreas,
    setIsLoadingSubjectAreas,
  };
};
