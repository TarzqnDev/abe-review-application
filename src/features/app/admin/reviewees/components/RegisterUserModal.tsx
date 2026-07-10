import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import { useRegisterUserModal } from "@/features/app/admin/reviewees/hooks/modals/useRegisterUserModal";

type RegisterUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRegistered: (message: string) => Promise<void>;
};

export const RegisterUserModal = (props: RegisterUserModalProps) => {
  const modal = useRegisterUserModal(props);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 px-4 py-6 transition-opacity duration-300 ${
        props.isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !modal.isSubmitting) props.onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-user-title"
    >
      <div
        className={`relative w-full max-w-[525px] rounded-lg bg-white px-9 py-10 shadow-xl transition-all duration-300 sm:px-9 ${
          props.isOpen ? "translate-y-0 scale-100" : "-translate-y-3 scale-95"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 id="register-user-title" className="text-xl font-semibold text-slate-900">
            Register User
          </h2>
          <button type="button" onClick={props.onClose} disabled={modal.isSubmitting} className="cursor-pointer text-slate-500 hover:text-slate-800" aria-label="Close registration modal">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <form onSubmit={modal.handleSubmit} className="space-y-5">
          <label className="block text-base font-medium text-slate-900">
            Full Name
            <input type="text" value={modal.fullName} onChange={(event) => modal.setFullName(event.target.value)} autoComplete="name" className="mt-2 h-[50px] w-full rounded border border-slate-200 px-4 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          </label>
          <label className="block text-base font-medium text-slate-900">
            Email Address
            <input type="email" value={modal.email} onChange={(event) => modal.setEmail(event.target.value)} autoComplete="email" className="mt-2 h-[50px] w-full rounded border border-slate-200 px-4 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          </label>
          <label className="block text-base font-medium text-slate-900">
            Mode of Review
            <span className="relative mt-2 block">
              <select value={modal.modeOfReview} onChange={(event) => modal.setModeOfReview(event.target.value)} className="h-[50px] w-full appearance-none rounded border border-slate-200 bg-white px-4 pr-11 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
                <option value="online">Online</option>
                <option value="in-house">In-House</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            </span>
          </label>

          <div>
            <p className="mb-2 text-base font-medium text-slate-900">Payment</p>
            <div
              className={`flex min-h-[150px] flex-col items-center justify-center rounded border bg-slate-50 px-5 py-5 text-center transition ${modal.isDragging ? "border-teal-500 bg-teal-50" : "border-slate-200"}`}
              onDragEnter={(event) => { event.preventDefault(); modal.setIsDragging(true); }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => { event.preventDefault(); modal.setIsDragging(false); }}
              onDrop={(event) => { event.preventDefault(); modal.setIsDragging(false); modal.selectPaymentImage(event.dataTransfer.files[0]); }}
            >
              {modal.paymentImage ? (
                <p className="max-w-full truncate text-sm font-medium text-slate-700">{modal.paymentImage.name}</p>
              ) : (
                <><p className="text-sm font-medium text-slate-800">Drop files here</p><p className="my-2 text-sm text-slate-500">Or</p></>
              )}
              <label className="mt-1 cursor-pointer rounded bg-teal-600 px-6 py-3 text-sm font-medium text-white hover:bg-teal-700">
                {modal.paymentImage ? "Change File" : "Choose File"}
                <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => modal.selectPaymentImage(event.target.files?.[0])} />
              </label>
              <p className="mt-2 text-xs text-slate-400">PNG, JPEG, or WebP up to 5 MB</p>
            </div>
          </div>

          {modal.error && <p role="alert" className="text-sm text-red-600">{modal.error}</p>}
          <button type="submit" disabled={modal.isSubmitting} className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded bg-teal-600 font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60">
            {modal.isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "Register User"}
          </button>
        </form>
      </div>
    </div>
  );
};
