import { PageContainer } from "@/components/PageContainer";
import { Trophy } from "lucide-react";

export const PromoPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('./resources/desktop.jpg')`,
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black/90 pointer-events-none" />
      <PageContainer className="z-10 flex items-center justify-center h-full">
        <div className="flex flex-col md:flex-row items-center justify-center text-center gap-4 md:gap-8 px-4">
          <Trophy className="w-20 h-20 md:w-32 lg:w-40 md:h-32 lg:h-40 text-yellow-400" />
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-2 md:mb-4">
              StrideChamp
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white">
              Coming soon...
            </h2>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
