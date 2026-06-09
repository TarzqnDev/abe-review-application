"use client";

import {
  PencilSquareIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAdminSubject } from "@/features/admin/subject/hooks/useAdminSubject";

export default function AdminSubjectPage() {
  const [openAddSubjectModal, setOpenAddSubjectModal] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successBannerMessage, setSuccessBannerMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    editingAreaId,
    editingAreaName,
    error,
    handleAreaNameChange,
    handleCancelAreaEditing,
    handleCloseAddSubjectModal,
    handleCreateSubject,
    handleOpenAddSubjectModal,
    handleStartAreaEditing,
    handleSubjectInput,
    handleUpdateArea,
    isCreatingSubject,
    isLoadingSubjectAreas,
    subjectAreas,
    subjectAreasError,
    subjectFormData,
  } = useAdminSubject();

  const openAddSubjectAreaModal = (areaId: number) => {
    handleOpenAddSubjectModal(areaId);
    setOpenAddSubjectModal(true);
  };

  const closeAddSubjectAreaModal = () => {
    setOpenAddSubjectModal(false);
    handleCloseAddSubjectModal();
  };

  const handleCreateSubjectSubmission = async (
    e: React.ChangeEvent<HTMLFormElement>,
  ) => {
    const result = await handleCreateSubject(e);

    if (!result.success) return;

    closeAddSubjectAreaModal();
    setSuccessBannerMessage(result.message);
    setShowSuccessBanner(true);
  };

  const handleAreaKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const result = await handleUpdateArea();

    if (!result.success) return;

    setSuccessBannerMessage(result.message);
    setShowSuccessBanner(true);
  };

  useEffect(() => {
    if (editingAreaId === null) return;

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editingAreaId]);

  useEffect(() => {
    if (!showSuccessBanner) return;

    const timeout = setTimeout(() => {
      setShowSuccessBanner(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showSuccessBanner]);

  return (
    <section>
      <div
        className={`fixed left-1/2 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ease-out ${
          showSuccessBanner
            ? "top-12 opacity-100"
            : "-top-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="rounded-lg border border-teal-700 bg-teal-800 px-5 py-4 shadow-lg">
          <p className="text-center font-medium text-white">
            {successBannerMessage}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="font-semibold text-2xl">Subject Contents</h1>
        <p className="text-lg text-stone-600">
          Manage subject content for the learning platform.
        </p>
      </div>

      <div className="w-full">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoadingSubjectAreas ? (
            <div className="w-full rounded-md border border-gray-300 bg-white p-4 text-stone-500">
              Loading subject areas...
            </div>
          ) : subjectAreasError ? (
            <div className="w-full rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
              {subjectAreasError}
            </div>
          ) : subjectAreas.length > 0 ? (
            subjectAreas.map((subjectArea) => (
              <div
                key={subjectArea.id}
                className="w-full rounded-md border border-gray-300 bg-white p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  {editingAreaId === subjectArea.id ? (
                    <input
                      ref={inputRef}
                      type="text"
                      name="areaName"
                      value={editingAreaName}
                      onChange={handleAreaNameChange}
                      onKeyDown={handleAreaKeyDown}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 font-medium text-lg"
                    />
                  ) : (
                    <h1 className="font-medium text-lg">{subjectArea.name}</h1>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openAddSubjectAreaModal(subjectArea.id)}
                      className="cursor-pointer"
                    >
                      <PlusIcon className="h-5 w-5 text-gray-500" />
                    </button>

                    {editingAreaId === subjectArea.id ? (
                      <button
                        type="button"
                        onClick={handleCancelAreaEditing}
                        className="cursor-pointer"
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleStartAreaEditing(
                            subjectArea.id,
                            subjectArea.name,
                          )
                        }
                        className="cursor-pointer"
                      >
                        <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>

                {editingAreaId === subjectArea.id && error && (
                  <p className="mb-4 text-sm text-red-500">{error}</p>
                )}

                <div className="flex flex-col gap-2">
                  {subjectArea.subjects.length > 0 ? (
                    subjectArea.subjects.map((subject) => (
                      <button
                        key={subject.id}
                        className="cursor-pointer rounded bg-gray-300 px-4 py-2 text-left"
                      >
                        {subject.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-stone-500">No subjects yet.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full rounded-md border border-gray-300 bg-white p-4 text-stone-500">
              No subject areas found.
            </div>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
          openAddSubjectModal
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeAddSubjectAreaModal}
        ></div>

        <div
          className={`relative w-full max-w-xl rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ease-out ${
            openAddSubjectModal
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-95 opacity-0"
          }`}
        >
          <div>
            <button
              type="button"
              onClick={closeAddSubjectAreaModal}
              className="absolute top-3 right-3 cursor-pointer"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-xl">Add Subject</h1>

            <form
              onSubmit={handleCreateSubjectSubmission}
              className="flex flex-col gap-4"
            >
              <input
                type="hidden"
                name="areaId"
                value={subjectFormData.areaId}
              />

              <div className="flex flex-col gap-2">
                <label htmlFor="subjectName" className="font-medium">
                  Subject Name
                </label>
                <input
                  id="subjectName"
                  name="subjectName"
                  type="text"
                  placeholder="Subject Name"
                  value={subjectFormData.subjectName}
                  onChange={handleSubjectInput}
                  required
                  maxLength={255}
                  className="w-full rounded-md border border-gray-300 px-4 py-3"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingSubject}
                className="flex cursor-pointer items-center justify-center rounded-md bg-teal-800 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCreatingSubject ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Add Subject"
                )}
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
