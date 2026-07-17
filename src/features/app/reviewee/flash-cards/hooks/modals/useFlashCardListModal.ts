import { useEffect, useMemo, useRef, useState } from "react";
import type { FlashCardFormModalRequest } from "@/features/app/reviewee/flash-cards/hooks/modals/useFlashCardFormModal";
import type {
  FlashCard,
  FlashCardDeck,
} from "@/features/app/reviewee/flash-cards/types/flashCard";

type UseFlashCardListModalProps = {
  flashCardDeck: FlashCardDeck | null;
  onClose: () => void;
};

export const useFlashCardListModal = ({
  flashCardDeck,
  onClose,
}: UseFlashCardListModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeleteFlashCard, setSelectedDeleteFlashCard] =
    useState<FlashCard | null>(null);
  const [flashCardFormRequest, setFlashCardFormRequest] =
    useState<FlashCardFormModalRequest | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!flashCardDeck) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const focusFrame = requestAnimationFrame(() =>
      searchInputRef.current?.focus(),
    );
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (flashCardFormRequest || selectedDeleteFlashCard) return;

      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) return;

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastFocusableElement
      ) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [flashCardDeck, flashCardFormRequest, onClose, selectedDeleteFlashCard]);

  const filteredFlashCards = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
    const flashCards = flashCardDeck?.cards ?? [];

    if (!normalizedSearchQuery) return flashCards;

    return flashCards.filter(
      (flashCard) =>
        flashCard.question
          .toLocaleLowerCase()
          .includes(normalizedSearchQuery) ||
        flashCard.answer.toLocaleLowerCase().includes(normalizedSearchQuery),
    );
  }, [flashCardDeck?.cards, searchQuery]);

  const handleCloseFlashCardListModal = () => {
    setSearchQuery("");
    setSelectedDeleteFlashCard(null);
    setFlashCardFormRequest(null);
    onClose();
  };

  const handleAddFlashCard = () => {
    if (!flashCardDeck) return;

    setFlashCardFormRequest({
      areaId: flashCardDeck.areaId,
      flashCard: null,
      lockArea: true,
      mode: "create",
      requestId: crypto.randomUUID(),
    });
  };

  const handleEditFlashCard = (flashCard: FlashCard) => {
    if (!flashCardDeck) return;

    setFlashCardFormRequest({
      areaId: flashCardDeck.areaId,
      flashCard,
      lockArea: true,
      mode: "edit",
      requestId: crypto.randomUUID(),
    });
  };

  const handleCloseFlashCardForm = () => {
    setFlashCardFormRequest(null);
  };

  const handleOpenDeleteConfirmation = (flashCard: FlashCard) => {
    setSelectedDeleteFlashCard(flashCard);
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedDeleteFlashCard(null);
  };

  return {
    dialogRef,
    filteredFlashCards,
    flashCardFormRequest,
    handleAddFlashCard,
    handleCloseDeleteConfirmation,
    handleCloseFlashCardForm,
    handleCloseFlashCardListModal,
    handleEditFlashCard,
    handleOpenDeleteConfirmation,
    searchQuery,
    searchInputRef,
    selectedDeleteFlashCard,
    setSearchQuery,
  };
};
