"use client";

import GameCountdownModal from "@/features/app/reviewee/mcq-quiz/components/GameCountdownModal";
import GameSelectionModal from "@/features/app/reviewee/mcq-quiz/components/GameSelectionModal";
import GameSummaryModal from "@/features/app/reviewee/mcq-quiz/components/GameSummaryModal";
import NoQuestionsModal from "@/features/app/reviewee/mcq-quiz/components/NoQuestionsModal";
import QuizCard from "@/features/app/reviewee/mcq-quiz/components/QuizCard";
import QuizGameModal from "@/features/app/reviewee/mcq-quiz/components/QuizGameModal";
import { quizGames } from "@/features/app/reviewee/mcq-quiz/constants/quizGames";
import { useRevieweeMcqQuiz } from "@/features/app/reviewee/mcq-quiz/hooks/useRevieweeMcqQuiz";

export default function RevieweeMcqQuizPage() {
  const mcqQuiz = useRevieweeMcqQuiz();

  return (
    <section>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">MCQ Quizzes</h1>
        <p className="mt-1 text-base text-slate-500">
          Choose a game to start answering quizzes
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {quizGames.map((quizGame) => (
          <QuizCard
            key={quizGame.title}
            quizGame={quizGame}
            onStart={(selectedQuizGame) =>
              mcqQuiz.openGameSelection(selectedQuizGame.gameType)
            }
          />
        ))}
      </div>

      {/* Modals Section */}
      <GameSelectionModal
        gameType={mcqQuiz.selectedGameType}
        isOpen={mcqQuiz.stage === "selection"}
        onClose={mcqQuiz.closeGameSelection}
        onNoQuestions={mcqQuiz.handleNoQuestions}
        onPrepared={mcqQuiz.handleSessionPrepared}
      />
      <GameCountdownModal
        isOpen={mcqQuiz.stage === "countdown"}
        onCancel={mcqQuiz.handleCountdownCancelled}
        onStarted={mcqQuiz.handleGameStarted}
        preparedSession={mcqQuiz.preparedSession}
      />
      <QuizGameModal
        initialTiming={mcqQuiz.initialTiming}
        isOpen={mcqQuiz.stage === "playing"}
        onFinished={mcqQuiz.handleGameFinished}
        preparedSession={mcqQuiz.preparedSession}
      />
      <NoQuestionsModal
        isOpen={mcqQuiz.noQuestions.isOpen}
        message={mcqQuiz.noQuestions.message}
        onClose={mcqQuiz.closeNoQuestions}
      />
      <GameSummaryModal
        isOpen={mcqQuiz.stage === "summary"}
        onClose={mcqQuiz.resetMcqQuizGame}
        summary={mcqQuiz.summary}
      />
    </section>
  );
}
