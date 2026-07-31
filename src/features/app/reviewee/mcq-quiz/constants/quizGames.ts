import type { StaticImageData } from "next/image";
import type { QuizGameType } from "@/features/app/reviewee/mcq-quiz/types/quiz";
import AbSolutionCardImage from "@/public/ab-solution-card-image.png";
import GuessTheWordCardImage from "@/public/guess-the-word-card-image.png";
import PaesCardImage from "@/public/paes-card-image.png";
import SituationshipCardImage from "@/public/situationship-card-image.png";

export type QuizGame = {
  title: string;
  description: string;
  gameType: QuizGameType;
  image: StaticImageData;
  imageAlt: string;
};

export const quizGames: QuizGame[] = [
  {
    title: "Guess the Word",
    description: "Identify ABE terminologies from their definitions.",
    gameType: "Guess the Word",
    image: GuessTheWordCardImage,
    imageAlt: "Letter tiles used for the Guess the Word quiz",
  },
  {
    title: "AB-Solution",
    description: "Apply ABE knowledge to solve practical problems.",
    gameType: "AB-Solution",
    image: AbSolutionCardImage,
    imageAlt: "Problem solving illustrations for the AB-Solution quiz",
  },
  {
    title: "Situationship",
    description: "Analyze ABE scenarios and choose the best course of action.",
    gameType: "Situationship",
    image: SituationshipCardImage,
    imageAlt: "Magnifying glass selecting a person for the Situationship quiz",
  },
  {
    title: "PAES",
    description: "Answer questions using PAES standards.",
    gameType: "PAES",
    image: PaesCardImage,
    imageAlt: "Wooden check marks surrounding a target for the PAES quiz",
  },
];
