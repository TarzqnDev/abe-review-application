"use client";

import {
  PlusIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function AdminSubjectPage() {
  const [openSubjectModal, setOpenSubjectModal] = useState(false);

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-semibold text-2xl">Subject Contents</h1>
        <p className="text-lg text-stone-600">
          Manage subject content for the learning platform.
        </p>
      </div>

      <div className="flex justify-end mb-8">
        <div>
          <button
            className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer flex items-center"
            onClick={() => setOpenSubjectModal(true)}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Subject
          </button>

          {openSubjectModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setOpenSubjectModal(false)}
              ></div>

              <div className="relative bg-white rounded-lg w-125 p-6">
                <div>
                  <button
                    onClick={() => setOpenSubjectModal(false)}
                    className="absolute top-3 right-3 cursor-pointer"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <h1 className="font-semibold text-xl">Register User</h1>

                  <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-medium">Subject Name</label>
                      <input
                        type="text"
                        placeholder="Subject Name"
                        className="border border-gray-300 w-full py-3 px-4 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="font-medium">
                        Select Area
                      </label>
                      <select className="border border-gray-300 w-full py-3 px-4 rounded-md">
                        <option>Area 1</option>
                        <option>Area 2</option>
                        <option>Area 3</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer"
                    >
                      Add Subject
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h1 className="font-semibold text-lg">Area 1</h1>
            <button className="flex text-stone-600 cursor-pointer">
              <PencilSquareIcon className="h-5 w-5 mr-2" />
              Edit Area
            </button>
          </div>
          <div className="flex gap-4">
            <p className="border rounded border-teal-500 bg-teal-100 py-3 px-4 font-medium">
              Subject 1
            </p>
            <p className="border rounded border-teal-500 bg-teal-100 py-3 px-4 font-medium">
              Subject 2
            </p>
            <p className="border rounded border-teal-500 bg-teal-100 py-3 px-4 font-medium">
              Subject 3
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h1 className="font-semibold text-lg">Area 2</h1>
            <button className="flex text-stone-600 cursor-pointer">
              <PencilSquareIcon className="h-5 w-5 mr-2" />
              Edit Area
            </button>
          </div>
          <div className="flex gap-4">
            <p className="border rounded border-teal-500 bg-teal-100 py-3 px-4 font-medium">
              Subject 1
            </p>
            <p className="border rounded border-teal-500 bg-teal-100 py-3 px-4 font-medium">
              Subject 2
            </p>
            <p className="border rounded border-teal-500 bg-teal-100 py-3 px-4 font-medium">
              Subject 3
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <h1 className="font-semibold text-lg">Area 3</h1>
            <button className="flex text-stone-600 cursor-pointer">
              <PencilSquareIcon className="h-5 w-5 mr-2" />
              Edit Area
            </button>
          </div>
          <div className="flex gap-4">
            <p className="border rounded border-teal-500 bg-teal-100 py-3 px-4 font-medium">
              Subject 1
            </p>
            <p className="border rounded border-teal-500 bg-teal-100 py-3 px-4 font-medium">
              Subject 2
            </p>
            <p className="border rounded border-teal-500 bg-teal-100 py-3 px-4 font-medium">
              Subject 3
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
