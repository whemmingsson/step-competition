import { Outlet } from "react-router";
import { Navigation } from "./Navigation";

// Shared authenticated layout for ALL authenticated routes including home
export const AuthenticatedLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
