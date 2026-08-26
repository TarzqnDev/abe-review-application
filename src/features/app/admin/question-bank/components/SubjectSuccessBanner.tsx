import SuccessBanner from "@/components/ui/SuccessBanner";

type SubjectSuccessBannerProps = {
  message: string;
  onDismiss: () => void;
  show: boolean;
};

export default function SubjectSuccessBanner({
  message,
  onDismiss,
  show,
}: SubjectSuccessBannerProps) {
  return <SuccessBanner message={message} onDismiss={onDismiss} show={show} />;
}
