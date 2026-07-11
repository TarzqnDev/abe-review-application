import { XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import { useRequestRegistrationModal } from "@/features/auth/accept-invite/hooks/modals/useRequestRegistrationModal";

type RequestRegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RequestRegistrationModal({
  isOpen,
  onClose,
}: RequestRegistrationModalProps) {
  const modal = useRequestRegistrationModal({ onClose });

  return (
    <>
      <div
        className={`fixed left-1/2 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ease-out ${
          modal.showSuccessBanner
            ? "top-36 opacity-100"
            : "pointer-events-none -top-24 opacity-0"
        }`}
      >
        <div className="rounded-lg border border-teal-700 bg-teal-800 px-5 py-4 shadow-lg">
          <p className="text-center font-medium text-white">
            {modal.successBannerMessage}
          </p>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close request access modal"
          className="absolute inset-0 bg-black/50"
          onClick={modal.handleClose}
        />
        <div
          className={`relative w-full max-w-xl rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ease-out ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-95 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={modal.handleClose}
            aria-label="Close request access modal"
            className="absolute top-3 right-3 cursor-pointer"
          >
            <XMarkIcon className="size-5 text-slate-500" />
          </button>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">
              Request Registration Access
            </h2>
            <p className="text-slate-600">
              Add your email address and we&apos;ll notify the admin once this
              feature is available.
            </p>
            <form
              onSubmit={modal.handleSubmission}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="requestAccessEmail" className="font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="requestAccessEmail"
                  name="email"
                  value={modal.formData.email}
                  onChange={modal.handleInput}
                  autoComplete="email"
                  className="h-12 w-full rounded-sm border border-slate-200 px-4 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                />
              </div>
              <button
                type="submit"
                disabled={modal.isSubmitting}
                className="flex h-12 cursor-pointer items-center justify-center rounded-sm bg-teal-600 px-4 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {modal.isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Submit Request"
                )}
              </button>
              {modal.error && (
                <p className="text-sm text-red-500">{modal.error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
