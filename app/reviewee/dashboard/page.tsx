"use client";

import { useRouter } from "next/navigation";

export default function RevieweeDashboardPage() {
  const router = useRouter();

  return (
    <div>
      <section>
        <div className="mx-72 mt-8">
          <div>
            <h1 className="font-semibold text-2xl">Welcome back, Mark!</h1>
            <span className="text-lg text-stone-600">
              Continue your ABE review journey and sharpen your skills.
            </span>
          </div>

          <div className="my-6">
            <h1 className="font-medium text-xl">Choose Your Learning Mode</h1>
          </div>

          <div className="flex gap-4">
            <div className="w-105">
              <div className="bg-teal-600 h-36 p-6 flex flex-col justify-center rounded-t-2xl">
                <h1 className="text-2xl text-white font-semibold">Solo Mode</h1>
              </div>
              <div className="p-6 border border-gray-300 rounded-b-2xl h-60 flex flex-col justify-between">
                <p>
                  Test your knowledge with interactive flashcards. Learn at your
                  own pace and build confidence.
                </p>
                <button
                  className="w-full py-2 font-semibold text-white bg-teal-800 rounded-md cursor-pointer"
                  onClick={() => router.push("/reviewee/game/solo")}
                >
                  Start Solo Mode
                </button>
              </div>
            </div>

            <div className="w-105">
              <div className="bg-teal-600 h-36 p-6 flex flex-col justify-center rounded-t-2xl">
                <h1 className="text-2xl text-white font-semibold">
                  Battle Mode
                </h1>
              </div>
              <div className="p-6 border border-gray-300 rounded-b-2xl h-60 flex flex-col justify-between">
                <p>
                  Challenge other students in real-time multiplayer battles.
                  Compete and climb the leaderboard!
                </p>
                <button
                  className="w-full py-2 font-semibold text-white bg-teal-800 rounded-md cursor-pointer"
                  onClick={() => router.push("/reviewee/game/battle")}
                >
                  Start Battle Mode
                </button>
              </div>
            </div>

            <div className="w-105">
              <div className="bg-teal-600 h-36 p-6 flex flex-col justify-center rounded-t-2xl">
                <h1 className="text-2xl text-white font-semibold">Quiz</h1>
              </div>
              <div className="p-6 border border-gray-300 rounded-b-2xl h-60 flex flex-col justify-between">
                <p>
                  Answer multiple-choice questions with time limits. Challenge
                  yourself and measure your understanding.
                </p>
                <button
                  className="w-full py-2 font-semibold text-white bg-teal-800 rounded-md cursor-pointer"
                  onClick={() => router.push("/reviewee/game/quiz")}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
