"use client";

import { useCallback, useEffect, useRef } from "react";

import { playAudio } from "@/utils/playAudio";

const COUNTDOWN_CUE_PATH = "/sounds/game-countdown-cue.wav";
const COUNTDOWN_START_CUE_PATH = "/sounds/game-countdown-start-cue.wav";
const PERFECT_CELEBRATION_PATH = "/sounds/perfect-game-celebration.wav";

export function useGameSounds() {
  const countdownCueRef = useRef<HTMLAudioElement | null>(null);
  const countdownStartCueRef = useRef<HTMLAudioElement | null>(null);
  const perfectCelebrationRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const countdownCue = new Audio(COUNTDOWN_CUE_PATH);
    const countdownStartCue = new Audio(COUNTDOWN_START_CUE_PATH);
    const perfectCelebration = new Audio(PERFECT_CELEBRATION_PATH);

    countdownCue.preload = "auto";
    countdownCue.volume = 0.55;
    countdownStartCue.preload = "auto";
    countdownStartCue.volume = 0.6;
    perfectCelebration.preload = "auto";
    perfectCelebration.volume = 0.75;

    countdownCueRef.current = countdownCue;
    countdownStartCueRef.current = countdownStartCue;
    perfectCelebrationRef.current = perfectCelebration;

    return () => {
      countdownCue.pause();
      countdownStartCue.pause();
      perfectCelebration.pause();
      countdownCueRef.current = null;
      countdownStartCueRef.current = null;
      perfectCelebrationRef.current = null;
    };
  }, []);

  const playCountdownCue = useCallback(() => {
    playAudio(countdownCueRef.current);
  }, []);

  const playCountdownStartCue = useCallback(() => {
    const preloadedCue = countdownStartCueRef.current;
    if (!preloadedCue) return;

    const oneShotCue = preloadedCue.cloneNode(true) as HTMLAudioElement;
    oneShotCue.volume = preloadedCue.volume;

    const releaseOneShotCue = () => {
      oneShotCue.removeEventListener("ended", releaseOneShotCue);
      oneShotCue.removeEventListener("error", releaseOneShotCue);
    };

    oneShotCue.addEventListener("ended", releaseOneShotCue);
    oneShotCue.addEventListener("error", releaseOneShotCue);
    void oneShotCue.play().catch(releaseOneShotCue);
  }, []);

  const playPerfectCelebration = useCallback(() => {
    playAudio(perfectCelebrationRef.current);
  }, []);

  return {
    playCountdownCue,
    playCountdownStartCue,
    playPerfectCelebration,
  };
}
