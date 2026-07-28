import SuccessBanner from "@/components/ui/SuccessBanner";

type SubjectSuccessBannerProps = {
  message: string;
  show: boolean;
};

export default function SubjectSuccessBanner({
  message,
  show,
}: SubjectSuccessBannerProps) {
  return <SuccessBanner message={message} show={show} />;
}
