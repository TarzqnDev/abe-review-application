import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchActivityHistory } from "@/features/app/reviewee/history/actions/fetch-activity-history.action";
import type { ActivityHistoryEntry } from "@/features/app/reviewee/history/types/activityHistory";

export type ActivityTypeFilter = "all" | "mcq_quiz" | "flash_cards";
export type ActivityStatusFilter =
  | "all"
  | "completed"
  | "exited"
  | "cancelled";

const HISTORY_PAGE_SIZE = 8;

export const useRevieweeHistory = () => {
  const [history, setHistory] = useState<ActivityHistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] =
    useState<ActivityTypeFilter>("all");
  const [statusFilter, setStatusFilter] =
    useState<ActivityStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHistory, setSelectedHistory] =
    useState<ActivityHistoryEntry | null>(null);

  const loadHistory = useCallback(async (showLoadingState = false) => {
    if (showLoadingState) setIsLoadingHistory(true);

    const result = await fetchActivityHistory();

    if (result.success) {
      setHistory(result.history);
      setHistoryError("");
    } else {
      setHistory([]);
      setHistoryError(result.error ?? "Unable to load your activity history.");
    }

    setIsLoadingHistory(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => loadHistory(true));
  }, [loadHistory]);

  const overviewStats = useMemo(() => {
    const completedSessions = history.filter(
      (historyEntry) => historyEntry.status === "completed",
    ).length;
    const scoredSessions = history.filter(
      (historyEntry) => historyEntry.questionsReached > 0,
    );
    const totalAccuracy = scoredSessions.reduce(
      (accuracySum, historyEntry) =>
        accuracySum + historyEntry.accuracyPercentage,
      0,
    );
    const totalStudySeconds = history.reduce(
      (durationSum, historyEntry) =>
        durationSum + historyEntry.durationSeconds,
      0,
    );

    return {
      averageAccuracy:
        scoredSessions.length > 0
          ? Math.round(totalAccuracy / scoredSessions.length)
          : 0,
      completedSessions,
      totalSessions: history.length,
      totalStudySeconds,
    };
  }, [history]);

  const filteredHistory = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();

    return history.filter((historyEntry) => {
      const matchesActivityType =
        activityTypeFilter === "all" ||
        historyEntry.sessionType === activityTypeFilter;
      const matchesStatus =
        statusFilter === "all" || historyEntry.status === statusFilter;
      const searchableText = [
        historyEntry.areaName,
        historyEntry.gameType,
        historyEntry.difficulty ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase();

      return (
        matchesActivityType &&
        matchesStatus &&
        searchableText.includes(normalizedSearchQuery)
      );
    });
  }, [activityTypeFilter, history, searchQuery, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredHistory.length / HISTORY_PAGE_SIZE),
  );
  const activePage = Math.min(currentPage, totalPages);
  const paginatedHistory = useMemo(() => {
    const firstHistoryIndex = (activePage - 1) * HISTORY_PAGE_SIZE;
    return filteredHistory.slice(
      firstHistoryIndex,
      firstHistoryIndex + HISTORY_PAGE_SIZE,
    );
  }, [activePage, filteredHistory]);

  const handleActivityTypeFilterChange = (filter: ActivityTypeFilter) => {
    setActivityTypeFilter(filter);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (filter: ActivityStatusFilter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return {
    activityTypeFilter,
    closeHistoryDetails: () => setSelectedHistory(null),
    currentPage: activePage,
    filteredHistoryCount: filteredHistory.length,
    history,
    historyError,
    isLoadingHistory,
    openHistoryDetails: setSelectedHistory,
    overviewStats,
    paginatedHistory,
    retryLoadHistory: () => void loadHistory(true),
    searchQuery,
    selectedHistory,
    setActivityTypeFilter: handleActivityTypeFilterChange,
    setCurrentPage,
    setSearchQuery: handleSearchQueryChange,
    setStatusFilter: handleStatusFilterChange,
    statusFilter,
    totalPages,
  };
};
