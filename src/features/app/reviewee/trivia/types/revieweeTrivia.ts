export type RevieweeTrivia = {
  content: string;
  publishDate: string;
};

export type FetchTodaysTriviaResult =
  | {
      queriedDate: string;
      success: true;
      trivia: RevieweeTrivia | null;
    }
  | {
      success: false;
      error: string;
      trivia: null;
    };
