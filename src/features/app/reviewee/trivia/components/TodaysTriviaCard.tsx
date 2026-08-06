"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useId } from "react";
import type { RevieweeTrivia } from "@/features/app/reviewee/trivia/types/revieweeTrivia";
import DidYouKnowImage from "@/public/did-you-know.png";

export type TodaysTriviaCardProps = {
  isExpanded: boolean;
  isLoading: boolean;
  loadError: string;
  retryLoadTrivia: () => void;
  toggleExpanded: () => void;
  trivia: RevieweeTrivia | null;
};

export default function TodaysTriviaCard({
  isExpanded,
  isLoading,
  loadError,
  retryLoadTrivia,
  toggleExpanded,
  trivia,
}: TodaysTriviaCardProps) {
  const contentId = useId();

  if (isLoading) return null;

  if (loadError) {
    return (
      <div
        role="alert"
        className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface px-5 py-3 text-sm text-secondary-text"
      >
        <p>{loadError}</p>
        <button
          type="button"
          onClick={retryLoadTrivia}
          className="cursor-pointer font-semibold text-primary-dark transition-colors hover:text-primary-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!trivia) return null;

  return (
    <aside
      aria-label="Today's trivia"
      className="relative mb-8 mt-5 w-full rounded-lg border border-primary-accent bg-teal-50/70 px-5 py-5 text-primary-text"
    >
      <button
        type="button"
        aria-controls={contentId}
        aria-expanded={isExpanded}
        onClick={toggleExpanded}
        className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-text md:hidden"
      >
        <span className="flex items-center gap-2">
          <Image
            src={DidYouKnowImage}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="text-xl font-semibold">Did You Know?</span>
        </span>
        <ChevronDownIcon
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div className="hidden items-center md:flex">
        <Image
          src={DidYouKnowImage}
          alt=""
          width={88}
          height={88}
          className="absolute -top-10 -left-10 h-20 w-20 shrink-0 object-contain"
        />
        <h2 className="text-xl font-semibold">Did You Know?</h2>
      </div>

      <div id={contentId} hidden={!isExpanded} className="md:hidden">
        <p className="mt-3 text-sm font-medium leading-relaxed">
          {trivia.content}
        </p>
      </div>
      <p className="mt-3 hidden text-sm font-medium leading-relaxed md:block">
        {trivia.content}
      </p>
    </aside>
  );
}
