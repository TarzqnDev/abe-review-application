import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function AdminMCQContentPage() {
  return (
    <section>
      <div>
        <Link
          href="/admin/subject"
          className="text-teal-600 flex items-center mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 inline-block mr-1" />
          Back to Subjects
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="font-semibold text-2xl">MCQ Content Management</h1>
        <p className="text-lg text-stone-600">
          Manage MCQ content for the learning platform.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="font-semibold text-xl">Select Game</h1>
        </div>
        <div className="flex gap-4">
          <div>
            <button className="border rounded border-gray-300 bg-white hover:bg-teal-100 hover:border-teal-500 transition duration-200 ease-in-out py-3 px-4 font-medium cursor-pointer">
              Guess the Word
            </button>
          </div>

          <div>
            <button className="border rounded border-gray-300 bg-white hover:bg-teal-100 hover:border-teal-500 transition duration-200 ease-in-out py-3 px-4 font-medium cursor-pointer">
              AB-Solution
            </button>
          </div>

          <div>
            <button className="border rounded border-gray-300 bg-white hover:bg-teal-100 hover:border-teal-500 transition duration-200 ease-in-out py-3 px-4 font-medium cursor-pointer">
              Situationship
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-semibold text-xl">Select Mode</h1>
        </div>
        <div className="flex gap-4">
          <div>
            <button className="border rounded border-gray-300 bg-white hover:bg-teal-100 hover:border-teal-500 transition duration-200 ease-in-out py-3 px-4 font-medium cursor-pointer">
              Easy
            </button>
          </div>

          <div>
            <button className="border rounded border-gray-300 bg-white hover:bg-teal-100 hover:border-teal-500 transition duration-200 ease-in-out py-3 px-4 font-medium cursor-pointer">
              Medium
            </button>
          </div>

          <div>
            <button className="border rounded border-gray-300 bg-white hover:bg-teal-100 hover:border-teal-500 transition duration-200 ease-in-out py-3 px-4 font-medium cursor-pointer">
              Hard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
