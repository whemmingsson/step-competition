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
      className={`container max-w-xl py-10 flex min-h-screen items-center justify-center gap-2 ${
        flexRows ? "flex-row" : "flex-col"
      }`}
    >
      {children}
      <Toaster />
    </div>
  );
};
