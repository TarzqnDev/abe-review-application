import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchTrivias } from "@/features/app/admin/trivias/actions/fetch-trivias.action";
import { TRIVIAS_PAGE_SIZE } from "@/features/app/admin/trivias/constants/adminTrivias";
import type {
  AdminTrivia,
  TriviaFormModalRequest,
  TriviaMonthGroup,
} from "@/features/app/admin/trivias/types/adminTrivia";
import {
  getTriviaMonthKey,
  getTriviaMonthLabel,
} from "@/features/app/admin/trivias/utils/adminTriviaDates";

export const useAdminTrivias = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formModalRequest, setFormModalRequest] =
    useState<TriviaFormModalRequest | null>(null);
  const [isLoadingTrivias, setIsLoadingTrivias] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [triviaToDelete, setTriviaToDelete] = useState<AdminTrivia | null>(null);
  const [trivias, setTrivias] = useState<AdminTrivia[]>([]);

  const loadTrivias = useCallback(async (showLoadingState = false) => {
    if (showLoadingState) setIsLoadingTrivias(true);

    try {
      const result = await fetchTrivias();

      if (!result.success) {
        setLoadError(result.error ?? "Unable to load trivias.");
        setTrivias([]);
        return;
      }

      setTrivias(result.trivias ?? []);
      setLoadError("");
    } catch {
      setLoadError("Unable to load trivias. Please try again.");
      setTrivias([]);
    } finally {
      setIsLoadingTrivias(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => loadTrivias(true));
  }, [loadTrivias]);

  useEffect(() => {
    if (!successMessage) return;

    const dismissTimer = window.setTimeout(() => setSuccessMessage(""), 3000);
    return () => window.clearTimeout(dismissTimer);
  }, [successMessage]);

  const sortedTrivias = useMemo(
    () =>
      [...trivias].sort(
        (firstTrivia, secondTrivia) =>
          firstTrivia.publishDate.localeCompare(secondTrivia.publishDate) ||
          firstTrivia.id - secondTrivia.id,
      ),
    [trivias],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(sortedTrivias.length / TRIVIAS_PAGE_SIZE),
  );
  const activePage = Math.min(currentPage, totalPages);
  const firstTriviaIndex = (activePage - 1) * TRIVIAS_PAGE_SIZE;
  const paginatedTrivias = sortedTrivias.slice(
    firstTriviaIndex,
    firstTriviaIndex + TRIVIAS_PAGE_SIZE,
  );
  const monthCounts = useMemo(() => {
    const counts = new Map<string, number>();

    sortedTrivias.forEach((trivia) => {
      const monthKey = getTriviaMonthKey(trivia.publishDate);
      counts.set(monthKey, (counts.get(monthKey) ?? 0) + 1);
    });

    return counts;
  }, [sortedTrivias]);
  const triviaMonthGroups = paginatedTrivias.reduce<TriviaMonthGroup[]>(
    (monthGroups, trivia) => {
      const monthKey = getTriviaMonthKey(trivia.publishDate);
      const currentGroup = monthGroups.at(-1);

      if (currentGroup?.key === monthKey) {
        currentGroup.trivias.push(trivia);
        return monthGroups;
      }

      monthGroups.push({
        count: monthCounts.get(monthKey) ?? 0,
        key: monthKey,
        label: getTriviaMonthLabel(trivia.publishDate),
        trivias: [trivia],
      });
      return monthGroups;
    },
    [],
  );

  const openCreateTriviaModal = () => {
    setFormModalRequest({
      mode: "create",
      requestId: crypto.randomUUID(),
      trivia: null,
    });
  };

  const openEditTriviaModal = (trivia: AdminTrivia) => {
    setFormModalRequest({
      mode: "edit",
      requestId: crypto.randomUUID(),
      trivia,
    });
  };

  const closeTriviaFormModal = () => {
    if (triviaToDelete) return;
    setFormModalRequest(null);
  };

  const handleTriviaDeleted = () => {
    setTriviaToDelete(null);
    setFormModalRequest(null);
  };

  return {
    closeDeleteConfirmationModal: () => setTriviaToDelete(null),
    closeTriviaFormModal,
    currentPage: activePage,
    firstTriviaNumber: sortedTrivias.length === 0 ? 0 : firstTriviaIndex + 1,
    formModalRequest,
    handleTriviaDeleted,
    isLoadingTrivias,
    lastTriviaNumber: Math.min(
      firstTriviaIndex + TRIVIAS_PAGE_SIZE,
      sortedTrivias.length,
    ),
    loadError,
    loadTrivias,
    openCreateTriviaModal,
    openDeleteConfirmationModal: setTriviaToDelete,
    openEditTriviaModal,
    retryLoadTrivias: () => void loadTrivias(true),
    setCurrentPage,
    showSuccessMessage: setSuccessMessage,
    successMessage,
    totalPages,
    totalTrivias: sortedTrivias.length,
    triviaMonthGroups,
    triviaToDelete,
  };
};
