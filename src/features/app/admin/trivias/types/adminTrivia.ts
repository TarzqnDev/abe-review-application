export type AdminTrivia = {
  content: string;
  createdAt: string;
  id: number;
  publishDate: string;
  updatedAt: string;
};

export type TriviaFormModalRequest = {
  initialPublishDate?: string;
  mode: "create" | "edit";
  requestId: string;
  trivia: AdminTrivia | null;
};

export type TriviaDateSlot = {
  date: string;
  trivia: AdminTrivia | null;
};
