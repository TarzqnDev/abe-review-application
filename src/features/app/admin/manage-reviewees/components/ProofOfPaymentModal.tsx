import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useId, type RefObject } from "react";
import { ProofOfPaymentSkeleton } from "@/features/app/admin/manage-reviewees/components/skeletons/ProofOfPaymentSkeleton";
import { useProofOfPaymentModal } from "@/features/app/admin/manage-reviewees/hooks/modals/useProofOfPaymentModal";

type ProofOfPaymentModalProps = {
  imagePath: string | null;
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  revieweeName: string;
  sourceImageUrl?: string;
};

export const ProofOfPaymentModal = (props: ProofOfPaymentModalProps) => {
  const titleId = useId();
  const { closeButtonRef, dialogRef, error, handleClose, imageUrl, isLoading } =
    useProofOfPaymentModal(props);

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-3 transition-opacity duration-300 sm:p-6 ${props.isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-hidden={!props.isOpen}
    >
      <div
        ref={dialogRef}
        inert={!props.isOpen}
        className={`relative flex h-[calc(100vh-1.5rem)] w-full max-w-4xl flex-col rounded-lg bg-surface p-4 shadow-xl transition-all duration-300 sm:h-[calc(100vh-3rem)] sm:p-6 ${props.isOpen ? "translate-y-0 scale-100" : "-translate-y-3 scale-95"}`}
      >
        <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
          <div>
            <h2
              id={titleId}
              className="text-xl font-semibold text-primary-text"
            >
              Proof of Payment
            </h2>
            {props.revieweeName && (
              <p className="mt-1 text-sm text-secondary-text">
                {props.revieweeName}
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded text-secondary-text hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
            aria-label="Close proof of payment viewer"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded bg-secondary-bg">
          {isLoading ? (
            <ProofOfPaymentSkeleton />
          ) : error ? (
            <p className="px-6 text-center text-sm text-secondary-text">
              {error}
            </p>
          ) : imageUrl ? (
            <div className="relative h-full min-h-[240px] w-full">
              <Image
                src={imageUrl}
                alt={`Proof of payment for ${props.revieweeName}`}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          ) : props.imagePath ? (
            <ProofOfPaymentSkeleton />
          ) : (
            <p className="px-6 text-center text-sm text-secondary-text">
              No proof of payment is available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
