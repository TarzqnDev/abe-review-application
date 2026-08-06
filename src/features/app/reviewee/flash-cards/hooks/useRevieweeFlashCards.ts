import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchFlashCardDecks } from "@/features/app/reviewee/flash-cards/actions/fetch-flash-card-decks.action";
import { fetchRevieweeFlashCardsPageData } from "@/features/app/reviewee/flash-cards/actions/fetch-reviewee-flash-cards-page-data.action";
import { previewFlashCardSession } from "@/features/app/reviewee/flash-cards/actions/game/preview-flash-card-session.action";
import type { FlashCardFormModalRequest } from "@/features/app/reviewee/flash-cards/hooks/modals/useFlashCardFormModal";
import type {
  FetchFlashCardDecksResult,
  FlashCardDeck,
} from "@/features/app/reviewee/flash-cards/types/flashCard";
import type {
  FlashCardCountdownDetails,
  FlashCardSummary,
  FlashCardTiming,
  PreparedFlashCardSession,
} from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { useTodaysTriviaCard } from "@/features/app/reviewee/trivia/hooks/useTodaysTriviaCard";
import { createBrowserRequestId } from "@/utils/createBrowserRequestId";

export type RevieweeFlashCardGameStage =
  | "idle"
  | "countdown"
  | "playing"
  | "summary";

export const useRevieweeFlashCards = () => {
  const hasStartedInitialLoadRef = useRef(false);
  const isPreparingGameRef = useRef(false);
  const todaysTriviaCard = useTodaysTriviaCard();
  const { applyTriviaResult, beginTriviaRequest } = todaysTriviaCard;
  const [flashCardDecks, setFlashCardDecks] = useState<FlashCardDeck[]>([]);
  const [isLoadingInitialPageData, setIsLoadingInitialPageData] =
    useState(true);
  const [isLoadingFlashCardDecks, setIsLoadingFlashCardDecks] = useState(true);
  const [flashCardDecksError, setFlashCardDecksError] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [formModalRequest, setFormModalRequest] =
    useState<FlashCardFormModalRequest | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [gameStage, setGameStage] =
    useState<RevieweeFlashCardGameStage>("idle");
  const [preparingAreaId, setPreparingAreaId] = useState<number | null>(null);
  const [countdownDetails, setCountdownDetails] =
    useState<FlashCardCountdownDetails | null>(null);
  const [preparedSession, setPreparedSession] =
    useState<PreparedFlashCardSession | null>(null);
  const [initialTiming, setInitialTiming] =
    useState<FlashCardTiming | null>(null);
  const [gameSummary, setGameSummary] = useState<FlashCardSummary | null>(null);
  const [gameError, setGameError] = useState("");
  const [noFlashCards, setNoFlashCards] = useState({
    isOpen: false,
    message: "There are no flash cards available for this area yet.",
  });

  const applyFlashCardDecksResult = useCallback(
    (result: FetchFlashCardDecksResult) => {
      if (result.success) {
        setFlashCardDecks(result.decks);
        setFlashCardDecksError("");
        return;
      }

      setFlashCardDecks([]);
      setFlashCardDecksError(
        result.error ?? "Unable to load your flash card areas.",
      );
    },
    [],
  );

  const loadFlashCardDecks = useCallback(async (showLoadingState = false) => {
    if (showLoadingState) setIsLoadingFlashCardDecks(true);

    const result = await fetchFlashCardDecks();
    applyFlashCardDecksResult(result);

    setIsLoadingFlashCardDecks(false);
  }, [applyFlashCardDecksResult]);

  useEffect(() => {
    if (hasStartedInitialLoadRef.current) return;

    hasStartedInitialLoadRef.current = true;
    const triviaRequestId = beginTriviaRequest(true);

    void Promise.resolve().then(async () => {
      try {
        const result = await fetchRevieweeFlashCardsPageData();
        applyFlashCardDecksResult(result.flashCardDecks);
        applyTriviaResult(triviaRequestId, result.todaysTrivia);
      } catch {
        applyFlashCardDecksResult({
          success: false,
          decks: [],
          error: "Unable to load your flash card areas.",
        });
        applyTriviaResult(triviaRequestId, {
          success: false,
          error: "Unable to load today's trivia.",
          trivia: null,
        });
      } finally {
        setIsLoadingFlashCardDecks(false);
        setIsLoadingInitialPageData(false);
      }
    });
  }, [
    applyFlashCardDecksResult,
    applyTriviaResult,
    beginTriviaRequest,
  ]);

  useEffect(() => {
    if (!successMessage) return;

    const timeout = window.setTimeout(() => setSuccessMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  const selectedFlashCardDeck = useMemo(
    () =>
      flashCardDecks.find(
        (flashCardDeck) => flashCardDeck.areaId === selectedAreaId,
      ) ?? null,
    [flashCardDecks, selectedAreaId],
  );

  const openCreateFlashCardModal = () => {
    setFormModalRequest({
      requestId: createBrowserRequestId(),
      mode: "create",
      areaId: null,
      lockArea: false,
      flashCard: null,
    });
  };

  const resetFlashCardGame = useCallback(() => {
    isPreparingGameRef.current = false;
    setGameStage("idle");
    setPreparingAreaId(null);
    setCountdownDetails(null);
    setPreparedSession(null);
    setInitialTiming(null);
    setGameSummary(null);
    setGameError("");
    setNoFlashCards((currentState) => ({
      ...currentState,
      isOpen: false,
    }));
  }, []);

  const handlePlayNow = useCallback(
    async (areaId: number) => {
      if (isPreparingGameRef.current || gameStage !== "idle") return;

      isPreparingGameRef.current = true;
      setPreparingAreaId(areaId);
      setPreparedSession(null);
      setInitialTiming(null);
      setGameSummary(null);
      setGameError("");

      const result = await previewFlashCardSession({ areaId });

      if (!result.success) {
        setGameError(result.error ?? "Unable to preview this flash card game.");
        setPreparingAreaId(null);
        isPreparingGameRef.current = false;
        return;
      }

      if (result.noFlashCards || !result.countdownDetails) {
        setNoFlashCards((currentState) => ({
          ...currentState,
          isOpen: true,
        }));
        setPreparingAreaId(null);
        isPreparingGameRef.current = false;
        return;
      }

      setCountdownDetails(result.countdownDetails);
      setGameStage("countdown");
      setPreparingAreaId(null);
      isPreparingGameRef.current = false;
    },
    [gameStage],
  );

  const handleGameStarted = useCallback(
    (
      startedSession: PreparedFlashCardSession,
      timing: FlashCardTiming,
    ) => {
      setPreparedSession(startedSession);
      setInitialTiming(timing);
      setCountdownDetails(null);
      setGameStage("playing");
    },
    [],
  );

  const handleNoFlashCardsAfterCountdown = useCallback(() => {
    setGameStage("idle");
    setCountdownDetails(null);
    setNoFlashCards((currentState) => ({
      ...currentState,
      isOpen: true,
    }));
  }, []);

  const handleGameFinished = useCallback((summary: FlashCardSummary) => {
    setGameSummary(summary);
    setGameStage("summary");
  }, []);

  return {
    closeFlashCardFormModal: () => setFormModalRequest(null),
    closeFlashCardListModal: () => setSelectedAreaId(null),
    countdownDetails,
    flashCardDecks,
    flashCardDecksError,
    formModalRequest,
    gameError,
    gameStage,
    gameSummary,
    handleCountdownCancelled: resetFlashCardGame,
    handleGameFinished,
    handleNoFlashCardsAfterCountdown,
    handleGameStarted,
    handlePlayNow,
    initialTiming,
    isLoadingFlashCardDecks,
    isLoadingInitialPageData,
    isPreparingGame: preparingAreaId !== null,
    loadFlashCardDecks,
    noFlashCards,
    openCreateFlashCardModal,
    openFlashCardListModal: setSelectedAreaId,
    preparedSession,
    preparingAreaId,
    resetFlashCardGame,
    retryLoadFlashCardDecks: () => void loadFlashCardDecks(true),
    selectedFlashCardDeck,
    showSuccessMessage: setSuccessMessage,
    successMessage,
    todaysTriviaCard,
    closeNoFlashCards: () =>
      setNoFlashCards((currentState) => ({
        ...currentState,
        isOpen: false,
      })),
  };
};
