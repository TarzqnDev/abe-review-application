"use client";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function QuizGamePage() {
  const router = useRouter();
  return (
    <section className=" mx-72 mt-8">
      <div>
        <Link
          href="/reviewee/dashboard"
          className="text-teal-600 flex items-center mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 inline-block mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="font-semibold text-2xl">Quiz Game</h1>
        <span className="text-lg text-stone-600">
          Test your knowledge with interactive quizzes. Answer questions and
          track your progress.
        </span>
      </div>

      <div className="flex gap-4">
        <div className="w-105">
          <div className="bg-teal-600 h-36 p-6 flex flex-col justify-center rounded-t-2xl">
            <h1 className="text-2xl text-white font-semibold">
              Guess the Word
            </h1>
          </div>
          <div className="p-6 border border-gray-300 rounded-b-2xl h-60 flex flex-col justify-between">
            <p>
              Test your knowledge with interactive flashcards. Learn at your own
              pace and build confidence.
            </p>
            <button className="w-full py-2 font-semibold text-white bg-teal-800 rounded-md cursor-pointer">
              Start Quiz
            </button>
          </div>
        </div>
        <div className="w-105">
          <div className="bg-teal-600 h-36 p-6 flex flex-col justify-center rounded-t-2xl">
            <h1 className="text-2xl text-white font-semibold">AB-Solution</h1>
          </div>
          <div className="p-6 border border-gray-300 rounded-b-2xl h-60 flex flex-col justify-between">
            <p>
              Test your knowledge with interactive flashcards. Learn at your own
              pace and build confidence.
            </p>
            <button className="w-full py-2 font-semibold text-white bg-teal-800 rounded-md cursor-pointer">
              Start Quiz
            </button>
          </div>
        </div>
        <div className="w-105">
          <div className="bg-teal-600 h-36 p-6 flex flex-col justify-center rounded-t-2xl">
            <h1 className="text-2xl text-white font-semibold">Situationship</h1>
          </div>
          <div className="p-6 border border-gray-300 rounded-b-2xl h-60 flex flex-col justify-between">
            <p>
              Test your knowledge with interactive flashcards. Learn at your own
              pace and build confidence.
            </p>
            <button className="w-full py-2 font-semibold text-white bg-teal-800 rounded-md cursor-pointer">
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
