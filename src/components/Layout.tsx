import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { useEffect, useState } from "react";
import { Footer } from "./Footer";

// Shared authenticated layout for ALL authenticated routes including home
export const Layout = () => {
  // Track viewport width for responsive background switching
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Content layer (above overlay) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation />

        {/* Main content area with auto scrolling */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-full md:max-w-4xl px-4 py-6">
            <Outlet />
          </div>
        </div>

        {/* Footer will automatically be pushed to the bottom */}
        <Footer className="backdrop-blur-sm bg-background/30" />
      </div>
    </div>
  );
};
