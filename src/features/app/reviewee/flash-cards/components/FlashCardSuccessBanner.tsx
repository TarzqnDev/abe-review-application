import SuccessBanner from "@/components/ui/SuccessBanner";

type FlashCardSuccessBannerProps = {
  message: string;
};

export default function FlashCardSuccessBanner({
  message,
}: FlashCardSuccessBannerProps) {
  return <SuccessBanner message={message} show={Boolean(message)} />;
}
