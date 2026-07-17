import { useEffect, useRef, useState } from "react";
import { fetchQuizAreas } from "@/features/app/reviewee/mcq-quiz/actions/fetch-quiz-areas.action";
import { prepareQuizSession } from "@/features/app/reviewee/mcq-quiz/actions/prepare-quiz-session.action";
import type {
  PreparedQuizSession,
  QuizArea,
  QuizDifficulty,
  QuizGameType,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";

type UseGameSelectionModalOptions = {
  gameType: QuizGameType | null;
  isOpen: boolean;
  onClose: () => void;
  onNoQuestions: () => void;
  onPrepared: (session: PreparedQuizSession) => void;
};

const QUIZ_DIFFICULTIES: QuizDifficulty[] = ["Easy", "Medium", "Hard"];

export const useGameSelectionModal = ({
  gameType,
  isOpen,
  onClose,
  onNoQuestions,
  onPrepared,
}: UseGameSelectionModalOptions) => {
  const areaSelectRef = useRef<HTMLSelectElement>(null);
  const requestIdRef = useRef(0);
  const [areas, setAreas] = useState<QuizArea[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("Easy");
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState("");
  const modalAccessibility = useQuizModalAccessibility({
    initialFocusRef: areaSelectRef,
    isOpen,
    onClose: isPreparing ? undefined : onClose,
  });

  useEffect(() => {
    if (!isOpen) return;

    const activeRequestId = requestIdRef.current + 1;
    requestIdRef.current = activeRequestId;
    void Promise.resolve().then(async () => {
      setIsLoadingAreas(true);
      setError("");
      const result = await fetchQuizAreas();

      if (requestIdRef.current !== activeRequestId) return;

      if (!result.success) {
        setAreas([]);
        setSelectedAreaId("");
        setError(result.error ?? "Unable to load quiz areas.");
      } else {
        setAreas(result.areas);
        setSelectedAreaId((currentAreaId) => {
          const areaStillExists = result.areas.some(
            (area) => String(area.id) === currentAreaId,
          );

          return areaStillExists
            ? currentAreaId
            : String(result.areas[0]?.id ?? "");
        });
      }

      setIsLoadingAreas(false);
    });

    return () => {
      requestIdRef.current += 1;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;

    const resetTimeout = setTimeout(() => {
      setDifficulty("Easy");
      setError("");
      setIsPreparing(false);
    }, 300);

    return () => clearTimeout(resetTimeout);
  }, [isOpen]);

  const handleClose = () => {
    if (isPreparing) return;
    modalAccessibility.closeWithAnimation(onClose);
  };

  const handleStartNow = async () => {
    if (!gameType || isPreparing) return;

    const areaId = Number(selectedAreaId);

    if (!Number.isInteger(areaId) || areaId <= 0) {
      setError("Please select an area.");
      return;
    }

    setError("");
    setIsPreparing(true);
    const result = await prepareQuizSession({
      areaId,
      difficulty,
      gameType,
    });

    if (!result.success) {
      setError(result.error ?? "Unable to prepare this game.");
      setIsPreparing(false);
      return;
    }

    if (result.noQuestions || !result.preparedSession) {
      onNoQuestions();
      setIsPreparing(false);
      return;
    }

    onPrepared(result.preparedSession);
    setIsPreparing(false);
  };

  return {
    areaSelectRef,
    areas,
    difficulty,
    error,
    handleClose,
    handleStartNow,
    isLoadingAreas,
    isPreparing,
    modalAccessibility,
    quizDifficulties: QUIZ_DIFFICULTIES,
    selectedAreaId,
    setDifficulty,
    setSelectedAreaId,
  };
};
