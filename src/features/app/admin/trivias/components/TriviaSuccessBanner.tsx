import SuccessBanner from "@/components/ui/SuccessBanner";

type TriviaSuccessBannerProps = {
  message: string;
  onDismiss: () => void;
};

export default function TriviaSuccessBanner({
  message,
  onDismiss,
}: TriviaSuccessBannerProps) {
  return (
    <SuccessBanner
      message={message}
      onDismiss={onDismiss}
      show={Boolean(message)}
    />
  );
}
