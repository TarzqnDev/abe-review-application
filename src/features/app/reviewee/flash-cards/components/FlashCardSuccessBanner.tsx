import SuccessBanner from "@/components/ui/SuccessBanner";

type FlashCardSuccessBannerProps = {
  message: string;
  onDismiss: () => void;
};

export default function FlashCardSuccessBanner({
  message,
  onDismiss,
}: FlashCardSuccessBannerProps) {
  return (
    <SuccessBanner
      message={message}
      onDismiss={onDismiss}
      show={Boolean(message)}
    />
  );
}
