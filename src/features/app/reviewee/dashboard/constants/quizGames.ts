import type { StaticImageData } from "next/image";
import AbSolutionCardImage from "@/public/ab-solution-card-image.png";
import GuessTheWordCardImage from "@/public/guess-the-word-card-image.png";
import SituationshipCardImage from "@/public/situationship-card-image.png";

export type QuizGame = {
  title: string;
  description: string;
  href: string;
  image: StaticImageData;
  imageAlt: string;
};

export const quizGames: QuizGame[] = [
  {
    title: "Guess the Word",
    description: "Identify ABE terminologies from their definitions.",
    href: "/reviewee/game/quiz",
    image: GuessTheWordCardImage,
    imageAlt: "Letter tiles used for the Guess the Word quiz",
  },
  {
    title: "AB-Solution",
    description: "Apply ABE knowledge to solve practical problems.",
    href: "/reviewee/game/quiz",
    image: AbSolutionCardImage,
    imageAlt: "Problem solving illustrations for the AB-Solution quiz",
  },
  {
    title: "Situationship",
    description: "Analyze ABE scenarios and choose the best course of action.",
    href: "/reviewee/game/quiz",
    image: SituationshipCardImage,
    imageAlt: "Magnifying glass selecting a person for the Situationship quiz",
  },
];
