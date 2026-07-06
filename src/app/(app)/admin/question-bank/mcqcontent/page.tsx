"use client";

import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

export default function AdminMCQContentPage() {
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  return (
    <section>
      <div>
        <Link
          href="/admin/question-bank"
          className="text-teal-600 flex items-center mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 inline-block mr-1" />
          Back to Subjects
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="font-semibold text-2xl">Subject Name</h1>
        <p className="text-lg text-stone-600">
          Manage MCQ content for the learning platform.
        </p>
      </div>

      <div className="flex justify-between">
        <div>
          <ul className="flex gap-4">
            <li>Guess the Game</li>
            <li>AB-Solution</li>
            <li>Situationship</li>
          </ul>
        </div>

        <div>
          <button
            onClick={() => setOpenQuestionModal(true)}
            className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Question
          </button>

          {openQuestionModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setOpenQuestionModal(false)}
              ></div>

              <div className="relative bg-white rounded-lg w-125 p-6">
                <div>
                  <button
                    onClick={() => setOpenQuestionModal(false)}
                    className="absolute top-3 right-3 cursor-pointer"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <h1 className="font-semibold text-xl">Select Game Mode</h1>

                  <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-medium">Game</label>

                      <div className="flex gap-4">
                        {["Guess the Game", "AB-Solution", "Situationship"].map(
                          (game) => (
                            <label key={game}></label>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-medium">Mode</label>
                    </div>

                    <button className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer">
                      Proceed to Add Question
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
