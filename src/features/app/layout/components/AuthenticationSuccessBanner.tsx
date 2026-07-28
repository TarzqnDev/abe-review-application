import SuccessBanner from "@/components/ui/SuccessBanner";

type AuthenticationSuccessBannerProps = {
  message: string;
  show: boolean;
};

export default function AuthenticationSuccessBanner({
  message,
  show,
}: AuthenticationSuccessBannerProps) {
  return <SuccessBanner message={message} show={show} />;
}
