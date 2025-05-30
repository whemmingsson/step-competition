import { Outlet } from "react-router";
import { Navigation } from "./Navigation";
import { useEffect, useState } from "react";

// Shared authenticated layout for ALL authenticated routes including home
export const AuthenticatedLayout = () => {
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
      className="h-screen flex flex-col bg-cover bg-center bg-fixed relative overflow-hidden"
      style={{
        backgroundImage: isMobile
          ? "url('/resources/mobile.jpg')"
          : "url('/resources/desktop.jpg')",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Content layer (above overlay) */}
      <div className="relative z-10 flex flex-col h-full">
        <Navigation />
        <div className="flex-1 overflow-y-auto px-4 pb-16 pt-6 overflow-hidden">
          <div className="container mx-auto max-w-full md:max-w-4xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
