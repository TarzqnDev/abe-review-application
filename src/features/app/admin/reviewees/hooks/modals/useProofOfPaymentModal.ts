import { useEffect, useState } from "react";
import { getPaymentProofUrl } from "@/features/app/admin/reviewees/actions/get-payment-proof-url.action";

type ProofOfPaymentModalOptions = {
  imagePath: string | null;
  isOpen: boolean;
  onClose: () => void;
};

export const useProofOfPaymentModal = ({ imagePath, isOpen, onClose }: ProofOfPaymentModalOptions) => {
  const [paymentProof, setPaymentProof] = useState<{
    imagePath: string;
    imageUrl: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !imagePath) return;

    let isCurrentRequest = true;
    void Promise.resolve().then(async () => {
      setIsLoading(true);
      setError("");
      const result = await getPaymentProofUrl(imagePath);
      if (!isCurrentRequest) return;
      if (result.success && result.signedUrl) {
        setPaymentProof({ imagePath, imageUrl: result.signedUrl });
      }
      else setError(result.error ?? "Unable to load proof of payment.");
      setIsLoading(false);
    });

    return () => { isCurrentRequest = false; };
  }, [imagePath, isOpen]);

  const imageUrl = paymentProof?.imagePath === imagePath
    ? paymentProof.imageUrl
    : "";

  return { error, imageUrl, isLoading };
};
