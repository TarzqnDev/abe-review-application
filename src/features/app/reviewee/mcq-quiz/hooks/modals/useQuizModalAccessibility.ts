import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";

const MODAL_ANIMATION_DURATION_MS = 300;
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

type UseQuizModalAccessibilityOptions = {
  initialFocusRef?: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose?: () => void;
};

export const useQuizModalAccessibility = ({
  initialFocusRef,
  isOpen,
  onClose,
}: UseQuizModalAccessibilityOptions) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setIsVisible(isOpen);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusFrame = requestAnimationFrame(() => {
      const firstFocusableElement =
        initialFocusRef?.current ??
        dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusableElement?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements =
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

      if (!focusableElements?.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

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
  }, [initialFocusRef, isOpen, onClose]);

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    },
    [],
  );

  const closeWithAnimation = (onClosed: () => void) => {
    setIsVisible(false);

    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

    closeTimeoutRef.current = setTimeout(
      onClosed,
      MODAL_ANIMATION_DURATION_MS,
    );
  };

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && onClose) onClose();
  };

  return {
    closeWithAnimation,
    dialogRef,
    handleBackdropMouseDown,
    isVisible,
  };
};
