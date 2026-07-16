import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

type UseCreateTriviaModalProps = {
  closeWithAnimation: (onClosed: () => void) => void;
  isOpen: boolean;
  onClose: () => void;
};

const initialTriviaForm = {
  content: "",
  publishDate: "",
};

export const useCreateTriviaModal = ({
  closeWithAnimation,
  isOpen,
  onClose,
}: UseCreateTriviaModalProps) => {
  const [triviaContent, setTriviaContent] = useState(
    initialTriviaForm.content,
  );
  const [publishDate, setPublishDate] = useState(
    initialTriviaForm.publishDate,
  );
  const closeWithAnimationRef = useRef(closeWithAnimation);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    closeWithAnimationRef.current = closeWithAnimation;
    onCloseRef.current = onClose;
  }, [closeWithAnimation, onClose]);

  const handleCloseCreateTriviaModal = useCallback(() => {
    closeWithAnimationRef.current(() => {
      onCloseRef.current();
      setTriviaContent(initialTriviaForm.content);
      setPublishDate(initialTriviaForm.publishDate);
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseCreateTriviaModal();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [handleCloseCreateTriviaModal, isOpen]);

  const handleCreateTrivia = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCloseCreateTriviaModal();
  };

  return {
    handleCloseCreateTriviaModal,
    handleCreateTrivia,
    publishDate,
    setPublishDate,
    setTriviaContent,
    triviaContent,
  };
};
