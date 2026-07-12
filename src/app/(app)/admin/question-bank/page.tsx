"use client";

import AddSubjectModal from "@/features/app/admin/question-bank/components/AddSubjectModal";
import QuestionBankLoadingSkeleton from "@/features/app/admin/question-bank/components/QuestionBankLoadingSkeleton";
import SubjectAreaSection from "@/features/app/admin/question-bank/components/SubjectAreaSection";
import SubjectDetailsModal from "@/features/app/admin/question-bank/components/SubjectDetailsModal";
import SubjectFilters from "@/features/app/admin/question-bank/components/SubjectFilters";
import SubjectIntroCard from "@/features/app/admin/question-bank/components/SubjectIntroCard";
import SubjectSuccessBanner from "@/features/app/admin/question-bank/components/SubjectSuccessBanner";
import { useQuestionBank } from "@/features/app/admin/question-bank/hooks/useQuestionBank";

export default function AdminSubjectPage() {
  const {
    activeAreaFilter,
    filteredSubjectAreas,
    handleAreaFilterChange,
    handleCloseSubjectDetails,
    handleCloseAddSubjectModal,
    handleOpenAddSubjectModal,
    handleOpenSubjectDetails,
    handleSearchQueryChange,
    isLoadingSubjectAreas,
    loadSubjectAreas,
    searchQuery,
    selectedAddSubjectAreaId,
    selectedSubject,
    setIsLoadingSubjectAreas,
    showSuccessBanner,
    showSuccessMessage,
    subjectAreas,
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
        <h1 className="text-2xl font-semibold text-slate-950">Question Bank</h1>
        <p className="mt-1 text-base text-slate-500">
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
                onOpenSubjectDetails={handleOpenSubjectDetails}
                subjectArea={subjectArea}
              />
            ))
          ) : (
            <div className="rounded-md border border-slate-200 bg-white p-5 text-sm text-slate-500">
              No subjects found.
            </div>
          )}
        </>
      )}

      {/* Modals Section */}
      <AddSubjectModal
        key={selectedAddSubjectAreaId ?? "add-subject-modal"}
        areaId={selectedAddSubjectAreaId}
        loadSubjectAreas={loadSubjectAreas}
        onClose={handleCloseAddSubjectModal}
        setIsLoadingSubjectAreas={setIsLoadingSubjectAreas}
        showSuccessMessage={showSuccessMessage}
        subjectAreas={subjectAreas}
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
