"use client";

import ActivityHistoryEmpty from "@/features/app/reviewee/history/components/ActivityHistoryEmpty";
import ActivityHistoryError from "@/features/app/reviewee/history/components/ActivityHistoryError";
import ActivityHistoryFilters from "@/features/app/reviewee/history/components/ActivityHistoryFilters";
import ActivityHistoryList from "@/features/app/reviewee/history/components/ActivityHistoryList";
import ActivityHistoryOverview from "@/features/app/reviewee/history/components/ActivityHistoryOverview";
import ActivityHistoryPagination from "@/features/app/reviewee/history/components/ActivityHistoryPagination";
import ActivityHistorySkeleton from "@/features/app/reviewee/history/components/ActivityHistorySkeleton";
import HistoryDetailsModal from "@/features/app/reviewee/history/components/modals/HistoryDetailsModal";
import { useRevieweeHistory } from "@/features/app/reviewee/history/hooks/useRevieweeHistory";

export default function RevieweeHistoryPage() {
  const historyPage = useRevieweeHistory();

  return (
    <section>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-primary-text">
          Activity History
        </h1>
        <p className="mt-1 text-base text-secondary-text">
          Review your quiz results, flash card sessions, and study progress
        </p>
      </header>

      {historyPage.isLoadingHistory ? (
        <ActivityHistorySkeleton />
      ) : historyPage.historyError ? (
        <ActivityHistoryError
          message={historyPage.historyError}
          onRetry={historyPage.retryLoadHistory}
        />
      ) : (
        <>
          <ActivityHistoryOverview {...historyPage.overviewStats} />

          <ActivityHistoryFilters
            activityTypeFilter={historyPage.activityTypeFilter}
            onActivityTypeFilterChange={historyPage.setActivityTypeFilter}
            onSearchQueryChange={historyPage.setSearchQuery}
            onStatusFilterChange={historyPage.setStatusFilter}
            searchQuery={historyPage.searchQuery}
            statusFilter={historyPage.statusFilter}
          />

          {historyPage.paginatedHistory.length > 0 ? (
            <>
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-primary-text">
                    Recent Activities
                  </h2>
                  <p className="mt-0.5 text-xs text-secondary-text">
                    Showing your latest{" "}
                    {historyPage.filteredHistoryCount.toLocaleString()} saved
                    activities
                  </p>
                </div>
              </div>
              <ActivityHistoryList
                history={historyPage.paginatedHistory}
                onViewDetails={historyPage.openHistoryDetails}
              />
              <ActivityHistoryPagination
                currentPage={historyPage.currentPage}
                onPageChange={historyPage.setCurrentPage}
                totalItems={historyPage.filteredHistoryCount}
                totalPages={historyPage.totalPages}
              />
            </>
          ) : (
            <ActivityHistoryEmpty
              isFiltered={
                historyPage.history.length > 0 &&
                historyPage.filteredHistoryCount === 0
              }
            />
          )}
        </>
      )}

      {/* Modals Section */}
      <HistoryDetailsModal
        sessionId={historyPage.selectedHistory?.id ?? null}
        isOpen={historyPage.selectedHistory !== null}
        onClose={historyPage.closeHistoryDetails}
      />
    </section>
  );
}
