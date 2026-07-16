export type AdminTriviaStatus = "Published" | "Scheduled";

export type AdminTrivia = {
  content: string;
  id: number;
  publishDate: string;
  status: AdminTriviaStatus;
};
