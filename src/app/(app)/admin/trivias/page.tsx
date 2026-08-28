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
  const adminTriviasPage = useAdminTrivias();

  return (
    <section className="w-full max-w-5xl">
      <TriviaSuccessBanner
        message={adminTriviasPage.successMessage}
        onDismiss={adminTriviasPage.hideSuccessMessage}
      />

      <div>
        <h1 className="text-2xl font-semibold text-primary-text">ABE Trivia</h1>
        <p className="mt-1 text-base text-secondary-text">
          Create daily ABE trivia that appear on student dashboards
        </p>

        <button
          type="button"
          onClick={() => adminTriviasPage.openCreateTriviaModal()}
          className="mt-7 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded bg-primary-accent px-5 text-sm font-medium text-surface transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
        >
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Create Trivia
        </button>
      </div>

      <div className="mt-8">
        {adminTriviasPage.isLoadingTrivias ? (
          <TriviaListSkeleton />
        ) : adminTriviasPage.loadError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="text-sm text-red-700">{adminTriviasPage.loadError}</p>
            <button
              type="button"
              onClick={adminTriviasPage.retryLoadTrivias}
              className="mt-4 cursor-pointer rounded bg-primary-accent px-4 py-2 text-sm font-semibold text-surface transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <section>
              {adminTriviasPage.hasCurrentMonthDateSlots && (
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <h2 className="text-lg font-semibold text-primary-text">
                    Month of {adminTriviasPage.currentMonthLabel}
                  </h2>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-primary-dark">
                    {adminTriviasPage.scheduledTriviaCount}{" "}
                    {adminTriviasPage.scheduledTriviaCount === 1 ? "Trivia" : "Trivias"}
                  </span>
                </div>
              )}

              <div
                className={
                  adminTriviasPage.hasCurrentMonthDateSlots ? "mt-5 space-y-2" : "space-y-2"
                }
              >
                {adminTriviasPage.paginatedDateSlots.map((dateSlot) => {
                  const isNextMonthStart =
                    dateSlot.date === adminTriviasPage.nextMonthStartDate;

                  return (
                    <Fragment key={dateSlot.date}>
                      {isNextMonthStart && (
                        <div
                          className={`border-b border-border pb-4 ${
                            adminTriviasPage.hasCurrentMonthDateSlots ? "pt-6" : ""
                          }`}
                        >
                          <h2 className="text-lg font-semibold text-primary-text">
                            Month of {adminTriviasPage.nextMonthLabel}
                          </h2>
                        </div>
                      )}
                      <TriviaCard
                        date={dateSlot.date}
                        trivia={dateSlot.trivia}
                        onCreate={adminTriviasPage.openCreateTriviaModal}
                        onEdit={adminTriviasPage.openEditTriviaModal}
                      />
                    </Fragment>
                  );
                })}
              </div>
            </section>

            <TriviaPagination
              currentPage={adminTriviasPage.currentPage}
              firstDateNumber={adminTriviasPage.firstDateNumber}
              lastDateNumber={adminTriviasPage.lastDateNumber}
              onPageChange={adminTriviasPage.setCurrentPage}
              totalDates={adminTriviasPage.totalDateSlots}
              totalPages={adminTriviasPage.totalPages}
            />
          </>
        )}
      </div>

      {/* Modals Section */}
      <TriviaFormModal
        key={adminTriviasPage.formModalRequest?.requestId ?? "closed-trivia-form"}
        isDeleteConfirmationOpen={adminTriviasPage.triviaToDelete !== null}
        loadTrivias={adminTriviasPage.loadTrivias}
        onClose={adminTriviasPage.closeTriviaFormModal}
        onRequestDelete={adminTriviasPage.openDeleteConfirmationModal}
        request={adminTriviasPage.formModalRequest}
        showSuccessMessage={adminTriviasPage.showSuccessMessage}
      />
      <DeleteTriviaConfirmationModal
        key={adminTriviasPage.triviaToDelete?.id ?? "closed-delete-trivia"}
        loadTrivias={adminTriviasPage.loadTrivias}
        onClose={adminTriviasPage.closeDeleteConfirmationModal}
        onDeleted={adminTriviasPage.handleTriviaDeleted}
        showSuccessMessage={adminTriviasPage.showSuccessMessage}
        trivia={adminTriviasPage.triviaToDelete}
      />
    </section>
  );
}
