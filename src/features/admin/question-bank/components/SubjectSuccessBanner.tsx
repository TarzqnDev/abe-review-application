type SubjectSuccessBannerProps = {
  message: string;
  show: boolean;
};

export default function SubjectSuccessBanner({
  message,
  show,
}: SubjectSuccessBannerProps) {
  return (
    <div
      className={`fixed left-1/2 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ease-out ${
        show ? "top-12 opacity-100" : "pointer-events-none -top-24 opacity-0"
      }`}
    >
      <div className="rounded-md border border-teal-700 bg-teal-600 px-5 py-4 shadow-lg">
        <p className="text-center text-sm font-medium text-white">{message}</p>
      </div>
    </div>
  );
}
