"use client";

import DeleteSubjectConfirmationModal from "@/features/app/admin/question-bank/components/DeleteSubjectConfirmationModal";
import QuestionBankLoadingSkeleton from "@/features/app/admin/question-bank/components/QuestionBankLoadingSkeleton";
import PaesQuestionFormModal from "@/features/app/admin/question-bank/components/PaesQuestionFormModal";
import PaesQuestionListModal from "@/features/app/admin/question-bank/components/PaesQuestionListModal";
import SubjectAreaSection from "@/features/app/admin/question-bank/components/SubjectAreaSection";
import SubjectDetailsModal from "@/features/app/admin/question-bank/components/SubjectDetailsModal";
import SubjectFilters from "@/features/app/admin/question-bank/components/SubjectFilters";
import SubjectFormModal from "@/features/app/admin/question-bank/components/SubjectFormModal";
import SubjectIntroCard from "@/features/app/admin/question-bank/components/SubjectIntroCard";
import SubjectSuccessBanner from "@/features/app/admin/question-bank/components/SubjectSuccessBanner";
import { useQuestionBank } from "@/features/app/admin/question-bank/hooks/useQuestionBank";
import { isPaesSubjectArea } from "@/features/app/admin/question-bank/constants/questionBank";

export default function AdminSubjectPage() {
  const questionBankPage = useQuestionBank();

  return (
    <section>
      <SubjectSuccessBanner
        message={questionBankPage.successBannerMessage}
        onDismiss={questionBankPage.handleHideSuccessBanner}
        show={questionBankPage.showSuccessBanner}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary-text">Question Bank</h1>
        <p className="mt-1 text-base text-secondary-text">
          Manage and organize your question sets by subject, area, and
          difficulty
        </p>
      </div>

      {questionBankPage.isLoadingSubjectAreas ? (
        <QuestionBankLoadingSkeleton />
      ) : questionBankPage.subjectAreasError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {questionBankPage.subjectAreasError}
        </div>
      ) : (
        <>
          <div className="mb-12">
            <SubjectIntroCard
              onAddPaesQuestion={questionBankPage.handleOpenAddPaesQuestionModal}
              onAddSubject={questionBankPage.handleOpenAddSubjectModal}
              subjectAreas={questionBankPage.subjectAreas}
            />
          </div>

          <SubjectFilters
            activeAreaFilter={questionBankPage.activeAreaFilter}
            onAreaFilterChange={questionBankPage.handleAreaFilterChange}
            onSearchQueryChange={questionBankPage.handleSearchQueryChange}
            searchQuery={questionBankPage.searchQuery}
            subjectAreas={questionBankPage.subjectAreas}
          />

          {questionBankPage.filteredSubjectAreas.length > 0 ? (
            questionBankPage.filteredSubjectAreas.map((subjectArea) => (
              <SubjectAreaSection
                key={subjectArea.id}
                isPredefined={isPaesSubjectArea(subjectArea.name)}
                mode={questionBankPage.subjectAreaModes[subjectArea.id] ?? null}
                onModeChange={(mode) =>
                  questionBankPage.handleSubjectAreaModeChange(subjectArea.id, mode)
                }
                onSelectSubject={(subject) =>
                  questionBankPage.handleSelectSubject(
                    subject,
                    questionBankPage.subjectAreaModes[subjectArea.id] ?? null,
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
      <PaesQuestionFormModal
        key={
          questionBankPage.paesQuestionFormRequest?.requestId ??
          "standalone-paes-question-form-modal"
        }
        onClose={questionBankPage.handleClosePaesQuestionFormModal}
        request={questionBankPage.paesQuestionFormRequest}
        showSuccessMessage={questionBankPage.showSuccessMessage}
        subjects={
          questionBankPage.subjectAreas.find((subjectArea) =>
            isPaesSubjectArea(subjectArea.name),
          )?.subjects ?? []
        }
      />

      <PaesQuestionListModal
        key={questionBankPage.selectedPaesSubject?.id ?? "paes-question-list-modal"}
        onClose={questionBankPage.handleClosePaesQuestionList}
        open={questionBankPage.selectedPaesSubject !== null}
        showSuccessMessage={questionBankPage.showSuccessMessage}
        subject={questionBankPage.selectedPaesSubject}
        subjects={
          questionBankPage.subjectAreas.find((subjectArea) =>
            isPaesSubjectArea(subjectArea.name),
          )?.subjects ?? []
        }
      />

      <SubjectFormModal
        key={
          questionBankPage.selectedEditSubject
            ? `edit-subject-${questionBankPage.selectedEditSubject.id}`
            : questionBankPage.selectedAddSubjectAreaId
              ? `add-subject-${questionBankPage.selectedAddSubjectAreaId}`
              : "subject-form-modal"
        }
        areaId={questionBankPage.selectedEditSubject?.area_id ?? questionBankPage.selectedAddSubjectAreaId}
        loadSubjectAreas={questionBankPage.loadSubjectAreas}
        onClose={questionBankPage.handleCloseSubjectFormModal}
        onEditSuccess={questionBankPage.handleSubjectModeOperationSuccess}
        showSuccessMessage={questionBankPage.showSuccessMessage}
        subject={questionBankPage.selectedEditSubject}
        subjectAreas={questionBankPage.subjectAreas}
      />

      <DeleteSubjectConfirmationModal
        key={questionBankPage.selectedSubjectToDelete?.id ?? "delete-subject-modal"}
        loadSubjectAreas={questionBankPage.loadSubjectAreas}
        onClose={questionBankPage.handleCloseDeleteSubjectConfirmation}
        onDeleteSuccess={questionBankPage.handleSubjectModeOperationSuccess}
        showSuccessMessage={questionBankPage.showSuccessMessage}
        subject={questionBankPage.selectedSubjectToDelete}
      />

      <SubjectDetailsModal
        key={questionBankPage.selectedSubject?.id ?? "subject-details-modal"}
        onClose={questionBankPage.handleCloseSubjectDetails}
        open={questionBankPage.selectedSubject !== null}
        showSuccessMessage={questionBankPage.showSuccessMessage}
        subject={questionBankPage.selectedSubject}
      />
    </section>
  );
}
