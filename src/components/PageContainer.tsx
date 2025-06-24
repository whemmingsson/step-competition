import { Toaster } from "sonner";

export const PageContainer = ({
  children,
  flexRows,
  className = "",
}: {
  children: React.ReactNode;
  flexRows?: boolean;
  className?: string;
}) => {
  return (
    <div
      style={{ minHeight: "calc(100vh - 12rem)" }}
      className={
        `container max-w-2xl py-10 flex items-center justify-center gap-2 ${
          flexRows ? "flex-row" : "flex-col"
        }` +
        " " +
        className
      }
    >
      {children}
      <Toaster />
    </div>
  );
};
