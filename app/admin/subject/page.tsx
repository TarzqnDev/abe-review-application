"use client";

import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

export default function AdminSubjectPage() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="font-semibold text-2xl">Subject Contents</h1>
        <p className="text-lg text-stone-600">
          Manage subject content for the learning platform.
        </p>
      </div>

      <div className="w-full">
        <div className="flex gap-4">
          <div className="w-full bg-white border border-gray-300 rounded-md p-4 ">
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-medium text-lg">Area 1</h1>
              <div className="flex gap-2">
                <PlusIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
                <PencilSquareIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button className="bg-gray-300 py-2 px-4 rounded text-left cursor-pointer">
                Subject 1
              </button>
            </div>
          </div>

          <div className="w-full bg-white border border-gray-300 rounded-md p-4 ">
            <div className="flex justify-between items-center">
              <h1 className="font-medium text-lg">Area 2</h1>
              <div className="flex gap-2">
                <PlusIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
                <PencilSquareIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
              </div>
            </div>

            <div>
              <h1>Majo</h1>
            </div>
          </div>

          <div className="w-full bg-white border border-gray-300 rounded-md p-4">
            <div className="flex justify-between items-center">
              <h1 className="font-medium text-lg">Area 3</h1>
              <div className="flex gap-2">
                <PlusIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
                <PencilSquareIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
              </div>
            </div>

            <div>
              <h1>Majo</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
