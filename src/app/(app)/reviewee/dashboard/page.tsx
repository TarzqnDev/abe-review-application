import QuizCard from "@/features/app/reviewee/dashboard/components/QuizCard";
import { quizGames } from "@/features/app/reviewee/dashboard/constants/quizGames";

export default function RevieweeDashboardPage() {
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
          <QuizCard key={quizGame.title} quizGame={quizGame} />
        ))}
      </div>
    </section>
  );
}
