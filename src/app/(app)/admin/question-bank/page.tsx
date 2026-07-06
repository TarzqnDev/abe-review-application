"use client";

import AddSubjectModal from "@/features/admin/question-bank/components/AddSubjectModal";
import QuestionFormModal from "@/features/admin/question-bank/components/QuestionFormModal";
import QuestionListModal from "@/features/admin/question-bank/components/QuestionListModal";
import SubjectAreaSection from "@/features/admin/question-bank/components/SubjectAreaSection";
import SubjectDetailsModal from "@/features/admin/question-bank/components/SubjectDetailsModal";
import SubjectFilters from "@/features/admin/question-bank/components/SubjectFilters";
import SubjectIntroCard from "@/features/admin/question-bank/components/SubjectIntroCard";
import SubjectSuccessBanner from "@/features/admin/question-bank/components/SubjectSuccessBanner";
import { useQuestionBank } from "@/features/admin/question-bank/hooks/useQuestionBank";

export default function AdminSubjectPage() {
  const {
    activeAreaFilter,
    activeQuestionSetQuestions,
    activeQuestionSummary,
    error,
    filteredSubjectAreas,
    handleAreaFilterChange,
    handleCloseAddSubjectModal,
    handleCloseQuestionFormModal,
    handleCloseQuestionListModal,
    handleCloseSubjectDetails,
    handleCreateSubject,
    handleOpenAddSubjectModal,
    handleOpenCreateQuestionModal,
    handleOpenEditQuestionModal,
    handleOpenQuestionListModal,
    handleOpenSubjectDetails,
    handleQuestionInput,
    handleSaveQuestion,
    handleSearchQueryChange,
    handleSelectEditQuestion,
    handleSubjectInput,
    isCreatingSubject,
    isLoadingSubjectAreas,
    isLoadingQuestionSets,
    isSavingQuestion,
    openAddSubjectModal,
    openQuestionFormModal,
    openQuestionListModal,
    questionFormData,
    questionFormError,
    questionFormMode,
    questionListQuestions,
    questionSetsError,
    searchQuery,
    selectedEditQuestionId,
    selectedSubject,
    selectedSubjectSummariesByDifficulty,
    selectedSubjectTotalQuestions,
    showSuccessBanner,
    subjectAreas,
    subjectAreasError,
    subjectFormData,
    successBannerMessage,
  } = useQuestionBank();

  return (
    <section>
      <SubjectSuccessBanner
        message={successBannerMessage}
        show={showSuccessBanner}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-950">
          Question Bank
        </h1>
        <p className="mt-1 text-base text-slate-500">
          Manage and organize your question sets by subject, area, and
          difficulty
        </p>
      </div>

      {isLoadingSubjectAreas ? (
        <div className="rounded-md border border-slate-200 bg-white p-5 text-sm text-slate-500">
          Loading subject areas...
        </div>
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
        error={error}
        isCreatingSubject={isCreatingSubject}
        onClose={handleCloseAddSubjectModal}
        onCreateSubject={handleCreateSubject}
        onSubjectInput={handleSubjectInput}
        open={openAddSubjectModal}
        subjectAreas={subjectAreas}
        subjectFormData={subjectFormData}
      />

      <SubjectDetailsModal
        isLoadingQuestionSets={isLoadingQuestionSets}
        onAddQuestion={handleOpenCreateQuestionModal}
        onClose={handleCloseSubjectDetails}
        onEditQuestions={handleOpenEditQuestionModal}
        onViewQuestions={handleOpenQuestionListModal}
        open={selectedSubject !== null}
        questionSetsError={questionSetsError}
        subject={selectedSubject}
        summaryGroups={selectedSubjectSummariesByDifficulty}
        totalQuestions={selectedSubjectTotalQuestions}
      />

      <QuestionFormModal
        error={questionFormError}
        formData={questionFormData}
        isSaving={isSavingQuestion}
        mode={questionFormMode}
        onClose={handleCloseQuestionFormModal}
        onInput={handleQuestionInput}
        onSave={handleSaveQuestion}
        onSelectEditQuestion={handleSelectEditQuestion}
        open={openQuestionFormModal}
        questions={activeQuestionSetQuestions}
        selectedEditQuestionId={selectedEditQuestionId}
        subject={selectedSubject}
      />

      <QuestionListModal
        onClose={handleCloseQuestionListModal}
        open={openQuestionListModal}
        questions={questionListQuestions}
        summary={activeQuestionSummary}
      />
    </section>
  );
}
