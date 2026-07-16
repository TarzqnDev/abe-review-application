export type FlashCardQuestion = {
  id: string;
  question: string;
  answer: string;
};

export type FlashCardDeck = {
  id: string;
  area: string;
  title: string;
  updatedAt: string;
  questions: FlashCardQuestion[];
};
