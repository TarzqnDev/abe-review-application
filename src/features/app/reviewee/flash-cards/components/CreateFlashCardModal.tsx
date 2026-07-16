import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FLASH_CARD_AREAS } from "@/features/app/reviewee/flash-cards/constants/flashCards";
import { useCreateFlashCardModal } from "@/features/app/reviewee/flash-cards/hooks/modals/useCreateFlashCardModal";

type CreateFlashCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateFlashCardModal({
  isOpen,
  onClose,
}: CreateFlashCardModalProps) {
  const {
    area,
    areaSelectRef,
    answer,
    dialogRef,
    handleBackdropMouseDown,
    handleClose,
    handleSubmit,
    question,
    setArea,
    setAnswer,
    setQuestion,
  } = useCreateFlashCardModal({ isOpen, onClose });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 px-4 py-6 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onMouseDown={handleBackdropMouseDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-flash-card-title"
      aria-hidden={!isOpen}
    >
      <div
        ref={dialogRef}
        className={`relative w-full max-w-[525px] rounded-lg bg-white px-6 py-8 shadow-xl transition-all duration-300 sm:px-9 sm:py-10 ${
          isOpen ? "translate-y-0 scale-100" : "-translate-y-3 scale-95"
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2
            id="create-flash-card-title"
            className="text-xl font-semibold text-slate-900"
          >
            Create Flash Card
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label="Close create flash card modal"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-semibold text-slate-900">
            Area
            <span className="relative mt-2 block">
              <select
                ref={areaSelectRef}
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="h-[50px] w-full appearance-none rounded border border-slate-200 bg-white px-4 pr-11 text-base font-medium text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                {FLASH_CARD_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
            </span>
          </label>

          <label className="block text-sm font-semibold text-slate-900">
            Question
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              required
              rows={4}
              placeholder="Enter the front of your flash card"
              className="mt-2 w-full resize-none rounded border border-slate-200 px-4 py-3 text-base font-normal text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-900">
            Answer
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              required
              rows={4}
              placeholder="Enter the answer shown on the back"
              className="mt-2 w-full resize-none rounded border border-slate-200 px-4 py-3 text-base font-normal text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <button
            type="submit"
            className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded bg-teal-600 px-5 text-base font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            Create Flash Card
          </button>
        </form>
      </div>
    </div>
  );
}
