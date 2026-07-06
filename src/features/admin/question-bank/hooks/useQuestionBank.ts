import React, { useEffect, useMemo, useState } from "react";
import {
  fetchSubjectAreas,
  type AdminSubjectArea,
} from "@/features/admin/question-bank/actions/fetch-subject-areas.action";
import { updateSubjectArea } from "@/features/admin/question-bank/actions/update-subject-area.action";
import { useAddSubjectModal } from "@/features/admin/question-bank/hooks/modals/useAddSubjectModal";
import { useQuestionFormModal } from "@/features/admin/question-bank/hooks/modals/useQuestionFormModal";
import { useQuestionListModal } from "@/features/admin/question-bank/hooks/modals/useQuestionListModal";
import { useSubjectDetailsModal } from "@/features/admin/question-bank/hooks/modals/useSubjectDetailsModal";

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

  const addSubjectModal = useAddSubjectModal({
    loadSubjectAreas,
    setIsLoadingSubjectAreas,
    showSuccessMessage,
  });

  const subjectDetailsModal = useSubjectDetailsModal();

  const questionFormModal = useQuestionFormModal({
    loadSubjectQuestions: subjectDetailsModal.loadSubjectQuestions,
    questionSets: subjectDetailsModal.activeSubjectQuestionSets,
    questionSummaries: subjectDetailsModal.questionSummaries,
    selectedSubject: subjectDetailsModal.selectedSubject,
    showSuccessMessage,
  });

  const questionListModal = useQuestionListModal({
    questionSets: subjectDetailsModal.activeSubjectQuestionSets,
  });

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

  const selectedSubjectAreaName =
    addSubjectModal.selectedSubjectAreaName(subjectAreas);

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

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleAreaFilterChange = (areaFilter: SubjectAreaFilter) => {
    setActiveAreaFilter(areaFilter);
  };

  const handleCloseSubjectDetails = () => {
    subjectDetailsModal.handleCloseSubjectDetails();
    questionFormModal.handleCloseQuestionFormModal();
    questionListModal.handleCloseQuestionListModal();
  };

  const handleHideSuccessBanner = () => {
    setShowSuccessBanner(false);
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

      const {
        success,
        message,
      } = await updateSubjectArea(formDataSubmission);

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
    activeQuestionSetQuestions: questionFormModal.activeQuestionSetQuestions,
    activeQuestionSummary: questionListModal.activeQuestionSummary,
    editingAreaId,
    editingAreaName,
    error: addSubjectModal.error,
    filteredSubjectAreas,
    handleAreaFilterChange,
    handleAreaNameChange,
    handleCancelAreaEditing,
    handleCloseAddSubjectModal: addSubjectModal.handleCloseAddSubjectModal,
    handleCloseQuestionFormModal: questionFormModal.handleCloseQuestionFormModal,
    handleCloseQuestionListModal: questionListModal.handleCloseQuestionListModal,
    handleCloseSubjectDetails,
    handleCreateSubject: addSubjectModal.handleCreateSubject,
    handleHideSuccessBanner,
    handleOpenAddSubjectModal: addSubjectModal.handleOpenAddSubjectModal,
    handleOpenCreateQuestionModal: questionFormModal.handleOpenCreateQuestionModal,
    handleOpenEditQuestionModal: questionFormModal.handleOpenEditQuestionModal,
    handleOpenQuestionListModal: questionListModal.handleOpenQuestionListModal,
    handleOpenSubjectDetails: subjectDetailsModal.handleOpenSubjectDetails,
    handleQuestionInput: questionFormModal.handleQuestionInput,
    handleSaveQuestion: questionFormModal.handleSaveQuestion,
    handleSearchQueryChange,
    handleSelectEditQuestion: questionFormModal.handleSelectEditQuestion,
    handleStartAreaEditing,
    handleSubjectInput: addSubjectModal.handleSubjectInput,
    handleUpdateArea,
    isCreatingSubject: addSubjectModal.isCreatingSubject,
    isLoadingQuestionSets: subjectDetailsModal.isLoadingQuestionSets,
    isLoadingSubjectAreas,
    isSavingQuestion: questionFormModal.isSavingQuestion,
    isUpdatingArea,
    openAddSubjectModal: addSubjectModal.openAddSubjectModal,
    openQuestionFormModal: questionFormModal.openQuestionFormModal,
    openQuestionListModal: questionListModal.openQuestionListModal,
    questionFormData: questionFormModal.questionFormData,
    questionFormError: questionFormModal.questionFormError,
    questionFormMode: questionFormModal.questionFormMode,
    questionListQuestions: questionListModal.activeQuestionSetQuestions,
    questionSetsError: subjectDetailsModal.questionSetsError,
    searchQuery,
    selectedEditQuestion: questionFormModal.selectedEditQuestion,
    selectedEditQuestionId: questionFormModal.selectedEditQuestionId,
    selectedSubject: subjectDetailsModal.selectedSubject,
    selectedSubjectAreaName,
    selectedSubjectSummariesByDifficulty:
      subjectDetailsModal.selectedSubjectSummariesByDifficulty,
    selectedSubjectTotalQuestions:
      subjectDetailsModal.selectedSubjectTotalQuestions,
    showSuccessBanner,
    subjectAreas,
    subjectAreasError,
    subjectFormData: addSubjectModal.subjectFormData,
    successBannerMessage,
  };
};
