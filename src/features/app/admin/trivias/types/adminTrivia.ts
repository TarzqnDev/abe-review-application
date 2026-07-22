export type AdminTrivia = {
  content: string;
  createdAt: string;
  id: number;
  publishDate: string;
  updatedAt: string;
};

export type TriviaFormModalRequest = {
  mode: "create" | "edit";
  requestId: string;
  trivia: AdminTrivia | null;
};

export type TriviaMonthGroup = {
  count: number;
  key: string;
  label: string;
  trivias: AdminTrivia[];
};
