import { Outlet } from "react-router";
import { MainMenu } from "./MainMenu";
import { useEffect, useState } from "react";
import { Footer } from "./Footer";
import { useCompetition } from "@/hooks/useComptetition";
import { NoCompetitionAlert } from "./NoCompetitionAlert";

// Shared authenticated layout for ALL authenticated routes including home
export const Layout = () => {
  // Track viewport width for responsive background switching
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { competition, isLoading } = useCompetition();

  const mode = import.meta.env.VITE_COMPETITION_MODE;

  // TODO: Ask JT how to address flickering alert on initial load since CoPilot doesn't understand the issue
  let shouldRenderAlert = false;

  // If competition is loading, don't render the alert
  if (isLoading) {
    shouldRenderAlert = false;
  } else if (mode === "invite-only") {
    // If competition is invite-only, show alert if no competition is set
    shouldRenderAlert = !competition;
  } else {
    // For public competitions, do not show the alert
    shouldRenderAlert = false;
  }

  // Update on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: isMobile
          ? "url('./resources/mobile.jpg')"
          : "url('./resources/desktop.jpg')",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black/40 pointer-events-none" />

      {/* Content layer (above overlay) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <MainMenu />

        {/* Main content area with auto scrolling */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-full md:max-w-4xl px-4 py-6">
            {shouldRenderAlert && mode === "invite-only" && (
              <NoCompetitionAlert />
            )}
            <Outlet />
          </div>
        </div>

        {/* Footer will automatically be pushed to the bottom */}
        <Footer className="backdrop-blur-sm bg-background/30" />
      </div>
    </div>
  );
};
