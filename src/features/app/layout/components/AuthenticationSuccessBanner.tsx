import SuccessBanner from "@/components/ui/SuccessBanner";

type AuthenticationSuccessBannerProps = {
  message: string;
  onDismiss: () => void;
  show: boolean;
};

export default function AuthenticationSuccessBanner({
  message,
  onDismiss,
  show,
}: AuthenticationSuccessBannerProps) {
  return <SuccessBanner message={message} onDismiss={onDismiss} show={show} />;
}
