import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { FLASH_CARD_AREAS } from "@/features/app/reviewee/flash-cards/constants/flashCards";

type UseCreateFlashCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const INITIAL_AREA = FLASH_CARD_AREAS[0];

export const useCreateFlashCardModal = ({
  isOpen,
  onClose,
}: UseCreateFlashCardModalProps) => {
  const [area, setArea] = useState<string>(INITIAL_AREA);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const areaSelectRef = useRef<HTMLSelectElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    areaSelectRef.current?.focus();

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
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

    document.addEventListener("keydown", handleDialogKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [isOpen, onClose]);

  const resetForm = () => {
    setArea(INITIAL_AREA);
    setAnswer("");
    setQuestion("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) handleClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleClose();
  };

  return {
    area,
    areaSelectRef,
    answer,
    dialogRef,
    handleBackdropMouseDown,
    handleClose,
    handleSubmit,
    question,
    setArea,
    setAnswer,
    setQuestion,
  };
};
