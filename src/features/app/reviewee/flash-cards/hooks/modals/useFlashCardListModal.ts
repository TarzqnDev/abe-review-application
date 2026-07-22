import {
  type ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FlashCardFormModalRequest } from "@/features/app/reviewee/flash-cards/hooks/modals/useFlashCardFormModal";
import type {
  FlashCard,
  FlashCardDeck,
} from "@/features/app/reviewee/flash-cards/types/flashCard";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type UseFlashCardListModalProps = {
  flashCardDeck: FlashCardDeck | null;
  onClose: () => void;
};

const FLASH_CARDS_PER_PAGE = 10;

export const useFlashCardListModal = ({
  flashCardDeck,
  onClose,
}: UseFlashCardListModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeleteFlashCard, setSelectedDeleteFlashCard] =
    useState<FlashCard | null>(null);
  const [flashCardFormRequest, setFlashCardFormRequest] =
    useState<FlashCardFormModalRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  const isNestedModalOpen = Boolean(
    flashCardFormRequest || selectedDeleteFlashCard,
  );
  const isNestedModalOpenRef = useRef(isNestedModalOpen);
  const isOpen = flashCardDeck !== null;

  useBodyScrollLock(isOpen);

  useEffect(() => {
    onCloseRef.current = onClose;
    isNestedModalOpenRef.current = isNestedModalOpen;
  }, [isNestedModalOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const focusFrame = requestAnimationFrame(() =>
      searchInputRef.current?.focus(),
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isNestedModalOpenRef.current) return;

      if (event.key === "Escape") {
        onCloseRef.current();
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
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [isOpen]);

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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFlashCards.length / FLASH_CARDS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const firstFlashCardIndex = (safeCurrentPage - 1) * FLASH_CARDS_PER_PAGE;
  const paginatedFlashCards = filteredFlashCards.slice(
    firstFlashCardIndex,
    firstFlashCardIndex + FLASH_CARDS_PER_PAGE,
  );
  const firstFlashCardNumber = filteredFlashCards.length
    ? firstFlashCardIndex + 1
    : 0;
  const lastFlashCardNumber = Math.min(
    firstFlashCardIndex + FLASH_CARDS_PER_PAGE,
    filteredFlashCards.length,
  );

  const handleCloseFlashCardListModal = () => {
    setSearchQuery("");
    setSelectedDeleteFlashCard(null);
    setFlashCardFormRequest(null);
    setCurrentPage(1);
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

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return {
    currentPage: safeCurrentPage,
    dialogRef,
    filteredFlashCards,
    firstFlashCardNumber,
    flashCardFormRequest,
    handleAddFlashCard,
    handleCloseDeleteConfirmation,
    handleCloseFlashCardForm,
    handleCloseFlashCardListModal,
    handleEditFlashCard,
    handleOpenDeleteConfirmation,
    handlePageChange,
    handleSearchQueryChange,
    lastFlashCardNumber,
    isNestedModalOpen,
    paginatedFlashCards,
    searchQuery,
    searchInputRef,
    selectedDeleteFlashCard,
    totalPages,
  };
};
