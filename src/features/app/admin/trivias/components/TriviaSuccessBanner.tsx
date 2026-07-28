import SuccessBanner from "@/components/ui/SuccessBanner";

type TriviaSuccessBannerProps = {
  message: string;
};

export default function TriviaSuccessBanner({
  message,
}: TriviaSuccessBannerProps) {
  return <SuccessBanner message={message} show={Boolean(message)} />;
}
