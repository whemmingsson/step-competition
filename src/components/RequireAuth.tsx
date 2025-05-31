import { useAuth } from "@/context/auth/useAuth";
import { useLocation, Navigate, Outlet } from "react-router";
import { LoadingScreen } from "./LoadingScreen";

export const RequireAuth = () => {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};
