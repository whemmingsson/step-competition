import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import RegisterStepsPage from "@/pages/RegisterStepsPage";
import UserPage from "@/pages/UserPage";
import { Navigation } from "./Navigation";
import { LoginPage } from "@/pages/LoginPage";

// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
  </div>
);

// Shared authenticated layout for ALL authenticated routes including home
const AuthenticatedLayout = () => {
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

// Page components
const Home = () => <RegisterStepsPage />;
const User = () => <UserPage />;
const Team = () => <div>Team Page</div>;
const Leaderboard = () => <div>Leaderboard</div>;

// Auth check wrapper that works for all protected routes
const RequireAuth = () => {
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

export const AppRouter = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login page - separate from other routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* All authenticated routes use the same layout */}
        <Route element={<RequireAuth />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<User />} />
            <Route path="/team" element={<Team />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
