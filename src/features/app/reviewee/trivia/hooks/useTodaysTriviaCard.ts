import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTodaysTrivia } from "@/features/app/reviewee/trivia/actions/fetch-todays-trivia.action";
import type {
  FetchTodaysTriviaResult,
  RevieweeTrivia,
} from "@/features/app/reviewee/trivia/types/revieweeTrivia";
import { getManilaDateValue } from "@/features/app/reviewee/trivia/utils/getManilaDateValue";

export const useTodaysTriviaCard = () => {
  const currentDateRef = useRef(getManilaDateValue());
  const latestRequestIdRef = useRef(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [trivia, setTrivia] = useState<RevieweeTrivia | null>(null);

  const beginTriviaRequest = useCallback((showLoadingState = false) => {
    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;

    if (showLoadingState) setIsLoading(true);

    return requestId;
  }, []);

  const applyTriviaResult = useCallback(
    (requestId: number, result: FetchTodaysTriviaResult) => {
      if (requestId !== latestRequestIdRef.current) return;

      if (!result.success) {
        setLoadError(result.error);
        setTrivia(null);
        setIsLoading(false);
        return;
      }

      if (result.queriedDate !== currentDateRef.current) {
        setIsExpanded(true);
      }

      currentDateRef.current = result.queriedDate;
      setLoadError("");
      setTrivia(result.trivia);
      setIsLoading(false);
    },
    [],
  );

  const loadTrivia = useCallback(async (showLoadingState = false) => {
    const requestId = beginTriviaRequest(showLoadingState);

    try {
      const result = await fetchTodaysTrivia();
      applyTriviaResult(requestId, result);
    } catch {
      applyTriviaResult(requestId, {
        success: false,
        error: "Unable to load today's trivia.",
        trivia: null,
      });
    }
  }, [applyTriviaResult, beginTriviaRequest]);

  useEffect(() => {
    const dateRolloverInterval = window.setInterval(() => {
      const currentManilaDate = getManilaDateValue();

      if (currentManilaDate === currentDateRef.current) return;

      setIsExpanded(true);
      setTrivia(null);
      void loadTrivia();
    }, 60_000);

    return () => window.clearInterval(dateRolloverInterval);
  }, [loadTrivia]);

  return {
    applyTriviaResult,
    beginTriviaRequest,
    isExpanded,
    isLoading,
    loadError,
    retryLoadTrivia: () => void loadTrivia(true),
    toggleExpanded: () =>
      setIsExpanded((currentIsExpanded) => !currentIsExpanded),
    trivia,
  };
};
