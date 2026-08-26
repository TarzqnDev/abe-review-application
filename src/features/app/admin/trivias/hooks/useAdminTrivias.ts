import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchTrivias } from "@/features/app/admin/trivias/actions/fetch-trivias.action";
import { TRIVIAS_PAGE_SIZE } from "@/features/app/admin/trivias/constants/adminTrivias";
import type {
  AdminTrivia,
  TriviaDateSlot,
  TriviaFormModalRequest,
} from "@/features/app/admin/trivias/types/adminTrivia";
import {
  getCurrentTriviaMonthRange,
  getLocalDateValue,
  getRemainingTriviaMonthDates,
  getTriviaMonthLabel,
} from "@/features/app/admin/trivias/utils/adminTriviaDates";
import { createBrowserRequestId } from "@/utils/createBrowserRequestId";

export const useAdminTrivias = () => {
  const initialDateRange = getCurrentTriviaMonthRange();
  const [currentDateRange, setCurrentDateRange] = useState(initialDateRange);
  const [currentPage, setCurrentPage] = useState(1);
  const [formModalRequest, setFormModalRequest] =
    useState<TriviaFormModalRequest | null>(null);
  const [isLoadingTrivias, setIsLoadingTrivias] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [triviaToDelete, setTriviaToDelete] = useState<AdminTrivia | null>(null);
  const [trivias, setTrivias] = useState<AdminTrivia[]>([]);
  const todayDateRef = useRef(initialDateRange.todayDate);

  const loadTrivias = useCallback(async (showLoadingState = false) => {
    if (showLoadingState) setIsLoadingTrivias(true);

    try {
      const result = await fetchTrivias();

      if (!result.success) {
        setLoadError(result.error ?? "Unable to load trivias.");
        setTrivias([]);
        return;
      }

      if (result.dateRange.todayDate !== todayDateRef.current) {
        setCurrentPage(1);
      }

      setCurrentDateRange(result.dateRange);
      todayDateRef.current = result.dateRange.todayDate;
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
    const dateRolloverInterval = window.setInterval(() => {
      const currentManilaDate = getLocalDateValue();

      if (currentManilaDate === todayDateRef.current) return;

      void loadTrivias();
    }, 60_000);

    return () => window.clearInterval(dateRolloverInterval);
  }, [loadTrivias]);

  useEffect(() => {
    if (!successMessage) return;

    const dismissTimer = window.setTimeout(() => setSuccessMessage(""), 3000);
    return () => window.clearTimeout(dismissTimer);
  }, [successMessage]);

  const triviaByDate = useMemo(
    () => new Map(trivias.map((trivia) => [trivia.publishDate, trivia])),
    [trivias],
  );
  const remainingDateValues = useMemo(
    () =>
      getRemainingTriviaMonthDates(
        new Date(`${currentDateRange.todayDate}T00:00:00+08:00`),
      ),
    [currentDateRange.todayDate],
  );
  const dateSlots = useMemo<TriviaDateSlot[]>(
    () =>
      remainingDateValues.map((date) => ({
        date,
        trivia: triviaByDate.get(date) ?? null,
      })),
    [remainingDateValues, triviaByDate],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(dateSlots.length / TRIVIAS_PAGE_SIZE),
  );
  const activePage = Math.min(currentPage, totalPages);
  const firstDateIndex = (activePage - 1) * TRIVIAS_PAGE_SIZE;
  const paginatedDateSlots = dateSlots.slice(
    firstDateIndex,
    firstDateIndex + TRIVIAS_PAGE_SIZE,
  );
  const hasCurrentMonthDateSlots = paginatedDateSlots.some(
    (dateSlot) => dateSlot.date <= currentDateRange.monthEndDate,
  );
  const scheduledTriviaCount = dateSlots.filter(
    (dateSlot) =>
      dateSlot.date <= currentDateRange.monthEndDate &&
      dateSlot.trivia !== null,
  ).length;

  const openCreateTriviaModal = (initialPublishDate?: string) => {
    setFormModalRequest({
      initialPublishDate,
      isPublishDateLocked: initialPublishDate !== undefined,
      mode: "create",
      requestId: createBrowserRequestId(),
      trivia: null,
    });
  };

  const hideSuccessMessage = () => {
    setSuccessMessage("");
  };

  const openEditTriviaModal = (trivia: AdminTrivia) => {
    setFormModalRequest({
      isPublishDateLocked: true,
      mode: "edit",
      requestId: createBrowserRequestId(),
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
    currentMonthLabel: getTriviaMonthLabel(currentDateRange.todayDate),
    firstDateNumber: dateSlots.length === 0 ? 0 : firstDateIndex + 1,
    formModalRequest,
    handleTriviaDeleted,
    hasCurrentMonthDateSlots,
    hideSuccessMessage,
    isLoadingTrivias,
    lastDateNumber: Math.min(
      firstDateIndex + TRIVIAS_PAGE_SIZE,
      dateSlots.length,
    ),
    loadError,
    loadTrivias,
    nextMonthLabel: getTriviaMonthLabel(
      currentDateRange.nextMonthStartDate,
    ),
    nextMonthStartDate: currentDateRange.nextMonthStartDate,
    openCreateTriviaModal,
    openDeleteConfirmationModal: setTriviaToDelete,
    openEditTriviaModal,
    paginatedDateSlots,
    retryLoadTrivias: () => void loadTrivias(true),
    scheduledTriviaCount,
    setCurrentPage,
    showSuccessMessage: setSuccessMessage,
    successMessage,
    totalPages,
    totalDateSlots: dateSlots.length,
    triviaToDelete,
  };
};
