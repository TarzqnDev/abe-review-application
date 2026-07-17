import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchFlashCardDecks } from "@/features/app/reviewee/flash-cards/actions/fetch-flash-card-decks.action";
import type {
  FlashCard,
  FlashCardDeck,
} from "@/features/app/reviewee/flash-cards/types/flashCard";

export type FlashCardFormModalRequest = {
  requestId: string;
  mode: "create" | "edit";
  areaId: number | null;
  lockArea: boolean;
  flashCard: FlashCard | null;
};

export const useRevieweeFlashCards = () => {
  const [flashCardDecks, setFlashCardDecks] = useState<FlashCardDeck[]>([]);
  const [isLoadingFlashCardDecks, setIsLoadingFlashCardDecks] = useState(true);
  const [flashCardDecksError, setFlashCardDecksError] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [formModalRequest, setFormModalRequest] =
    useState<FlashCardFormModalRequest | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

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

  const openAddFlashCardModal = (areaId: number) => {
    setFormModalRequest({
      requestId: createRequestId(),
      mode: "create",
      areaId,
      lockArea: true,
      flashCard: null,
    });
  };

  const openEditFlashCardModal = (areaId: number, flashCard: FlashCard) => {
    setFormModalRequest({
      requestId: createRequestId(),
      mode: "edit",
      areaId,
      lockArea: true,
      flashCard,
    });
  };

  return {
    closeFlashCardFormModal: () => setFormModalRequest(null),
    closeFlashCardListModal: () => setSelectedAreaId(null),
    flashCardDecks,
    flashCardDecksError,
    formModalRequest,
    isLoadingFlashCardDecks,
    loadFlashCardDecks,
    openAddFlashCardModal,
    openCreateFlashCardModal,
    openEditFlashCardModal,
    openFlashCardListModal: setSelectedAreaId,
    retryLoadFlashCardDecks: () => void loadFlashCardDecks(true),
    selectedFlashCardDeck,
    showSuccessMessage: setSuccessMessage,
    successMessage,
  };
};
