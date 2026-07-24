"use client";

import DeleteSubjectConfirmationModal from "@/features/app/admin/question-bank/components/DeleteSubjectConfirmationModal";
import QuestionBankLoadingSkeleton from "@/features/app/admin/question-bank/components/QuestionBankLoadingSkeleton";
import SubjectAreaSection from "@/features/app/admin/question-bank/components/SubjectAreaSection";
import SubjectDetailsModal from "@/features/app/admin/question-bank/components/SubjectDetailsModal";
import SubjectFilters from "@/features/app/admin/question-bank/components/SubjectFilters";
import SubjectFormModal from "@/features/app/admin/question-bank/components/SubjectFormModal";
import SubjectIntroCard from "@/features/app/admin/question-bank/components/SubjectIntroCard";
import SubjectSuccessBanner from "@/features/app/admin/question-bank/components/SubjectSuccessBanner";
import { useQuestionBank } from "@/features/app/admin/question-bank/hooks/useQuestionBank";

export default function AdminSubjectPage() {
  const {
    activeAreaFilter,
    filteredSubjectAreas,
    handleAreaFilterChange,
    handleCloseDeleteSubjectConfirmation,
    handleCloseSubjectDetails,
    handleCloseSubjectFormModal,
    handleOpenAddSubjectModal,
    handleSearchQueryChange,
    handleSelectSubject,
    handleSubjectAreaModeChange,
    handleSubjectModeOperationSuccess,
    isLoadingSubjectAreas,
    loadSubjectAreas,
    searchQuery,
    selectedAddSubjectAreaId,
    selectedEditSubject,
    selectedSubject,
    selectedSubjectToDelete,
    setIsLoadingSubjectAreas,
    showSuccessBanner,
    showSuccessMessage,
    subjectAreas,
    subjectAreaModes,
    subjectAreasError,
    successBannerMessage,
  } = useQuestionBank();

  return (
    <section>
      <SubjectSuccessBanner
        message={successBannerMessage}
        show={showSuccessBanner}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary-text">Question Bank</h1>
        <p className="mt-1 text-base text-secondary-text">
          Manage and organize your question sets by subject, area, and
          difficulty
        </p>
      </div>

      {isLoadingSubjectAreas ? (
        <QuestionBankLoadingSkeleton />
      ) : subjectAreasError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {subjectAreasError}
        </div>
      ) : (
        <>
          <div className="mb-12">
            <SubjectIntroCard
              onAddSubject={handleOpenAddSubjectModal}
              subjectAreas={subjectAreas}
            />
          </div>

          <SubjectFilters
            activeAreaFilter={activeAreaFilter}
            onAreaFilterChange={handleAreaFilterChange}
            onSearchQueryChange={handleSearchQueryChange}
            searchQuery={searchQuery}
            subjectAreas={subjectAreas}
          />

          {filteredSubjectAreas.length > 0 ? (
            filteredSubjectAreas.map((subjectArea) => (
              <SubjectAreaSection
                key={subjectArea.id}
                mode={subjectAreaModes[subjectArea.id] ?? null}
                onModeChange={(mode) =>
                  handleSubjectAreaModeChange(subjectArea.id, mode)
                }
                onSelectSubject={(subject) =>
                  handleSelectSubject(
                    subject,
                    subjectAreaModes[subjectArea.id] ?? null,
                  )
                }
                subjectArea={subjectArea}
              />
            ))
          ) : (
            <div className="rounded-md border border-border bg-surface p-5 text-sm text-secondary-text">
              No subjects found.
            </div>
          )}
        </>
      )}

      {/* Modals Section */}
      <SubjectFormModal
        key={
          selectedEditSubject
            ? `edit-subject-${selectedEditSubject.id}`
            : selectedAddSubjectAreaId
              ? `add-subject-${selectedAddSubjectAreaId}`
              : "subject-form-modal"
        }
        areaId={selectedEditSubject?.area_id ?? selectedAddSubjectAreaId}
        loadSubjectAreas={loadSubjectAreas}
        onClose={handleCloseSubjectFormModal}
        onEditSuccess={handleSubjectModeOperationSuccess}
        setIsLoadingSubjectAreas={setIsLoadingSubjectAreas}
        showSuccessMessage={showSuccessMessage}
        subject={selectedEditSubject}
        subjectAreas={subjectAreas}
      />

      <DeleteSubjectConfirmationModal
        key={selectedSubjectToDelete?.id ?? "delete-subject-modal"}
        loadSubjectAreas={loadSubjectAreas}
        onClose={handleCloseDeleteSubjectConfirmation}
        onDeleteSuccess={handleSubjectModeOperationSuccess}
        showSuccessMessage={showSuccessMessage}
        subject={selectedSubjectToDelete}
      />

      <SubjectDetailsModal
        key={selectedSubject?.id ?? "subject-details-modal"}
        onClose={handleCloseSubjectDetails}
        open={selectedSubject !== null}
        showSuccessMessage={showSuccessMessage}
        subject={selectedSubject}
      />
    </section>
  );
}
