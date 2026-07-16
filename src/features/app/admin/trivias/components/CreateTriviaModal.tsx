import { useCreateTriviaModal } from "@/features/app/admin/trivias/hooks/modals/useCreateTriviaModal";
import { useModalAnimation } from "@/hooks/useModalAnimation";
import { XMarkIcon } from "@heroicons/react/24/outline";

type CreateTriviaModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateTriviaModal({
  isOpen,
  onClose,
}: CreateTriviaModalProps) {
  const { closeWithAnimation, isModalVisible } = useModalAnimation(isOpen);
  const {
    handleCloseCreateTriviaModal,
    handleCreateTrivia,
    publishDate,
    setPublishDate,
    setTriviaContent,
    triviaContent,
  } = useCreateTriviaModal({ closeWithAnimation, isOpen, onClose });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 transition-opacity duration-300 ${
        isModalVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-trivia-title"
      aria-hidden={!isModalVisible}
      inert={!isModalVisible}
    >
      <button
        type="button"
        onClick={handleCloseCreateTriviaModal}
        className="absolute inset-0 cursor-default bg-slate-950/35"
        aria-label="Close create trivia modal"
        tabIndex={-1}
      />

      <div
        className={`relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-md bg-white p-7 shadow-xl transition-all duration-300 ease-out sm:p-9 ${
          isModalVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={handleCloseCreateTriviaModal}
          className="absolute top-7 right-7 cursor-pointer rounded text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:top-9 sm:right-9"
          aria-label="Close create trivia modal"
        >
          <XMarkIcon className="h-7 w-7" aria-hidden="true" />
        </button>

        <h2
          id="create-trivia-title"
          className="mb-8 pr-12 text-xl font-semibold text-slate-950"
        >
          Create Trivia
        </h2>

        <form onSubmit={handleCreateTrivia} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="triviaContent" className="text-sm font-semibold">
              Trivia Content
            </label>
            <textarea
              id="triviaContent"
              name="triviaContent"
              value={triviaContent}
              onChange={(event) => setTriviaContent(event.target.value)}
              rows={7}
              maxLength={1000}
              required
              className="resize-none rounded border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="Share an interesting ABE fact or insight"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="publishDate" className="text-sm font-semibold">
              Publish Date
            </label>
            <input
              id="publishDate"
              name="publishDate"
              type="date"
              value={publishDate}
              onChange={(event) => setPublishDate(event.target.value)}
              required
              className="h-[50px] w-full rounded border border-slate-200 bg-white px-4 text-base text-slate-700 outline-none transition-colors focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <button
            type="submit"
            className="flex h-[50px] cursor-pointer items-center justify-center rounded bg-teal-600 px-5 text-base font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Create Trivia
          </button>
        </form>
      </div>
    </div>
  );
}
