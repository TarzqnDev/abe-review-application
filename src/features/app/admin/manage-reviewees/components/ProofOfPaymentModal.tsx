import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { ProofOfPaymentSkeleton } from "@/features/app/admin/manage-reviewees/components/skeletons/ProofOfPaymentSkeleton";
import { useProofOfPaymentModal } from "@/features/app/admin/manage-reviewees/hooks/modals/useProofOfPaymentModal";

type ProofOfPaymentModalProps = {
  imagePath: string | null;
  isOpen: boolean;
  onClose: () => void;
  revieweeName: string;
};

export const ProofOfPaymentModal = (props: ProofOfPaymentModalProps) => {
  const modal = useProofOfPaymentModal(props);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 px-4 py-6 transition-opacity duration-300 ${props.isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onMouseDown={(event) => { if (event.target === event.currentTarget) props.onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="proof-payment-title"
    >
      <div className={`relative w-full max-w-[525px] rounded-lg bg-surface px-9 py-10 shadow-xl transition-all duration-300 ${props.isOpen ? "translate-y-0 scale-100" : "-translate-y-3 scale-95"}`}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 id="proof-payment-title" className="text-xl font-semibold text-primary-text">Proof of Payment</h2>
            {props.revieweeName && <p className="mt-1 text-sm text-secondary-text">{props.revieweeName}</p>}
          </div>
          <button type="button" onClick={props.onClose} className="cursor-pointer text-secondary-text hover:text-slate-800" aria-label="Close proof of payment modal">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded bg-secondary-bg">
          {modal.isLoading ? (
            <ProofOfPaymentSkeleton />
          ) : modal.error ? (
            <p className="px-6 text-center text-sm text-secondary-text">{modal.error}</p>
          ) : modal.imageUrl ? (
            <div className="relative h-[min(70vh,680px)] w-full">
              <Image
                src={modal.imageUrl}
                alt={`Proof of payment for ${props.revieweeName}`}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          ) : (
            props.imagePath ? (
              <ProofOfPaymentSkeleton />
            ) : (
              <p className="px-6 text-center text-sm text-secondary-text">
                No proof of payment is available.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};
