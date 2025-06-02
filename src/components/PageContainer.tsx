import { Toaster } from "sonner";

export const PageContainer = ({
  children,
  flexRows,
}: {
  children: React.ReactNode;
  flexRows?: boolean;
}) => {
  return (
    <div
      style={{ minHeight: "calc(100vh - 12rem)" }}
      className={`container max-w-2xl py-10 flex items-center justify-center gap-2 ${
        flexRows ? "flex-row" : "flex-col"
      }`}
    >
      {children}
      <Toaster />
    </div>
  );
};
