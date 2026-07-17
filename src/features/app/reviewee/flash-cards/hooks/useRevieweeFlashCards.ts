import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchFlashCardDecks } from "@/features/app/reviewee/flash-cards/actions/fetch-flash-card-decks.action";
import { prepareFlashCardSession } from "@/features/app/reviewee/flash-cards/actions/game/prepare-flash-card-session.action";
import type { FlashCardFormModalRequest } from "@/features/app/reviewee/flash-cards/hooks/modals/useFlashCardFormModal";
import type { FlashCardDeck } from "@/features/app/reviewee/flash-cards/types/flashCard";
import type {
  FlashCardSummary,
  FlashCardTiming,
  PreparedFlashCardSession,
} from "@/features/app/reviewee/flash-cards/types/flashCardGame";

export type RevieweeFlashCardGameStage =
  | "idle"
  | "countdown"
  | "playing"
  | "summary";

export const useRevieweeFlashCards = () => {
  const isPreparingGameRef = useRef(false);
  const [flashCardDecks, setFlashCardDecks] = useState<FlashCardDeck[]>([]);
  const [isLoadingFlashCardDecks, setIsLoadingFlashCardDecks] = useState(true);
  const [flashCardDecksError, setFlashCardDecksError] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [formModalRequest, setFormModalRequest] =
    useState<FlashCardFormModalRequest | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [gameStage, setGameStage] =
    useState<RevieweeFlashCardGameStage>("idle");
  const [preparingAreaId, setPreparingAreaId] = useState<number | null>(null);
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

  const loadFlashCardDecks = useCallback(async (showLoadingState = false) => {
    if (showLoadingState) setIsLoadingFlashCardDecks(true);

    const result = await fetchFlashCardDecks();

    if (result.success) {
      setFlashCardDecks(result.decks);
      setFlashCardDecksError("");
    } else {
      setFlashCardDecks([]);
      setFlashCardDecksError(
        result.error ?? "Unable to load your flash card areas.",
      );
    }

    setIsLoadingFlashCardDecks(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => loadFlashCardDecks(true));
  }, [loadFlashCardDecks]);

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

  const createRequestId = () => crypto.randomUUID();

  const openCreateFlashCardModal = () => {
    setFormModalRequest({
      requestId: createRequestId(),
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

      const result = await prepareFlashCardSession({ areaId });

      if (!result.success) {
        setGameError(result.error ?? "Unable to prepare this flash card game.");
        setPreparingAreaId(null);
        isPreparingGameRef.current = false;
        return;
      }

      if (result.noFlashCards || !result.preparedSession) {
        setNoFlashCards((currentState) => ({
          ...currentState,
          isOpen: true,
        }));
        setPreparingAreaId(null);
        isPreparingGameRef.current = false;
        return;
      }

      setPreparedSession(result.preparedSession);
      setGameStage("countdown");
      setPreparingAreaId(null);
      isPreparingGameRef.current = false;
    },
    [gameStage],
  );

  const handleGameStarted = useCallback((timing: FlashCardTiming) => {
    setInitialTiming(timing);
    setGameStage("playing");
  }, []);

  const handleGameFinished = useCallback((summary: FlashCardSummary) => {
    setGameSummary(summary);
    setGameStage("summary");
  }, []);

  return {
    closeFlashCardFormModal: () => setFormModalRequest(null),
    closeFlashCardListModal: () => setSelectedAreaId(null),
    flashCardDecks,
    flashCardDecksError,
    formModalRequest,
    gameError,
    gameStage,
    gameSummary,
    handleCountdownCancelled: resetFlashCardGame,
    handleGameFinished,
    handleGameStarted,
    handlePlayNow,
    initialTiming,
    isLoadingFlashCardDecks,
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
    closeNoFlashCards: () =>
      setNoFlashCards((currentState) => ({
        ...currentState,
        isOpen: false,
      })),
  };
};
