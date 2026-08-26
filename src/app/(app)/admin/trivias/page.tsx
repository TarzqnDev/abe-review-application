"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import DeleteTriviaConfirmationModal from "@/features/app/admin/trivias/components/DeleteTriviaConfirmationModal";
import TriviaCard from "@/features/app/admin/trivias/components/TriviaCard";
import TriviaFormModal from "@/features/app/admin/trivias/components/TriviaFormModal";
import TriviaListSkeleton from "@/features/app/admin/trivias/components/TriviaListSkeleton";
import TriviaPagination from "@/features/app/admin/trivias/components/TriviaPagination";
import TriviaSuccessBanner from "@/features/app/admin/trivias/components/TriviaSuccessBanner";
import { useAdminTrivias } from "@/features/app/admin/trivias/hooks/useAdminTrivias";

export default function AdminTriviasPage() {
  const {
    closeDeleteConfirmationModal,
    closeTriviaFormModal,
    currentPage,
    currentMonthLabel,
    firstDateNumber,
    formModalRequest,
    handleTriviaDeleted,
    hasCurrentMonthDateSlots,
    hideSuccessMessage,
    isLoadingTrivias,
    lastDateNumber,
    loadError,
    loadTrivias,
    nextMonthLabel,
    nextMonthStartDate,
    openCreateTriviaModal,
    openDeleteConfirmationModal,
    openEditTriviaModal,
    paginatedDateSlots,
    retryLoadTrivias,
    scheduledTriviaCount,
    setCurrentPage,
    showSuccessMessage,
    successMessage,
    totalDateSlots,
    totalPages,
    triviaToDelete,
  } = useAdminTrivias();

  return (
    <section className="w-full max-w-5xl">
      <TriviaSuccessBanner
        message={successMessage}
        onDismiss={hideSuccessMessage}
      />

      <div>
        <h1 className="text-2xl font-semibold text-primary-text">ABE Trivia</h1>
        <p className="mt-1 text-base text-secondary-text">
          Create daily ABE trivia that appear on student dashboards
        </p>

        <button
          type="button"
          onClick={() => openCreateTriviaModal()}
          className="mt-7 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded bg-primary-accent px-5 text-sm font-medium text-surface transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
        >
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Create Trivia
        </button>
      </div>

      <div className="mt-8">
        {isLoadingTrivias ? (
          <TriviaListSkeleton />
        ) : loadError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="text-sm text-red-700">{loadError}</p>
            <button
              type="button"
              onClick={retryLoadTrivias}
              className="mt-4 cursor-pointer rounded bg-primary-accent px-4 py-2 text-sm font-semibold text-surface transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <section>
              {hasCurrentMonthDateSlots && (
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <h2 className="text-lg font-semibold text-primary-text">
                    Month of {currentMonthLabel}
                  </h2>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-primary-dark">
                    {scheduledTriviaCount}{" "}
                    {scheduledTriviaCount === 1 ? "Trivia" : "Trivias"}
                  </span>
                </div>
              )}

              <div
                className={
                  hasCurrentMonthDateSlots ? "mt-5 space-y-2" : "space-y-2"
                }
              >
                {paginatedDateSlots.map((dateSlot) => {
                  const isNextMonthStart =
                    dateSlot.date === nextMonthStartDate;

                  return (
                    <Fragment key={dateSlot.date}>
                      {isNextMonthStart && (
                        <div
                          className={`border-b border-border pb-4 ${
                            hasCurrentMonthDateSlots ? "pt-6" : ""
                          }`}
                        >
                          <h2 className="text-lg font-semibold text-primary-text">
                            Month of {nextMonthLabel}
                          </h2>
                        </div>
                      )}
                      <TriviaCard
                        date={dateSlot.date}
                        trivia={dateSlot.trivia}
                        onCreate={openCreateTriviaModal}
                        onEdit={openEditTriviaModal}
                      />
                    </Fragment>
                  );
                })}
              </div>
            </section>

            <TriviaPagination
              currentPage={currentPage}
              firstDateNumber={firstDateNumber}
              lastDateNumber={lastDateNumber}
              onPageChange={setCurrentPage}
              totalDates={totalDateSlots}
              totalPages={totalPages}
            />
          </>
        )}
      </div>

      {/* Modals Section */}
      <TriviaFormModal
        key={formModalRequest?.requestId ?? "closed-trivia-form"}
        isDeleteConfirmationOpen={triviaToDelete !== null}
        loadTrivias={loadTrivias}
        onClose={closeTriviaFormModal}
        onRequestDelete={openDeleteConfirmationModal}
        request={formModalRequest}
        showSuccessMessage={showSuccessMessage}
      />
      <DeleteTriviaConfirmationModal
        key={triviaToDelete?.id ?? "closed-delete-trivia"}
        loadTrivias={loadTrivias}
        onClose={closeDeleteConfirmationModal}
        onDeleted={handleTriviaDeleted}
        showSuccessMessage={showSuccessMessage}
        trivia={triviaToDelete}
      />
    </section>
  );
}
