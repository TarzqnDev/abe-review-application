import { Skeleton } from "@/components/ui/skeleton";

export const ProofOfPaymentSkeleton = () => (
  <div
    className="w-full space-y-4 px-6"
    role="status"
    aria-label="Loading proof of payment"
  >
    <Skeleton className="mx-auto h-72 w-full max-w-72 rounded-lg" />
    <Skeleton className="mx-auto h-4 w-36" />
    <span className="sr-only">Loading proof of payment...</span>
  </div>
);
