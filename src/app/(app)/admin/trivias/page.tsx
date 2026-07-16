"use client";

import CreateTriviaModal from "@/features/app/admin/trivias/components/CreateTriviaModal";
import TriviaCard from "@/features/app/admin/trivias/components/TriviaCard";
import { ADMIN_TRIVIAS } from "@/features/app/admin/trivias/constants/adminTrivias";
import { useAdminTrivias } from "@/features/app/admin/trivias/hooks/useAdminTrivias";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function AdminTriviasPage() {
  const {
    handleCloseCreateTriviaModal,
    handleOpenCreateTriviaModal,
    isCreateTriviaModalOpen,
  } = useAdminTrivias();

  return (
    <section>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">ABE Trivia</h1>
          <p className="mt-1 text-base text-slate-500">
            Create daily ABE trivia that appear on student dashboards
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateTriviaModal}
          className="inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded bg-teal-600 px-5 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Create Trivia
        </button>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {ADMIN_TRIVIAS.map((trivia) => (
          <TriviaCard key={trivia.id} trivia={trivia} />
        ))}
      </div>

      {/* Modals Section */}
      <CreateTriviaModal
        isOpen={isCreateTriviaModalOpen}
        onClose={handleCloseCreateTriviaModal}
      />
    </section>
  );
}
