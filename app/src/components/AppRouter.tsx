import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import RegisterStepsPage from "@/pages/RegisterStepsPage";
import UserPage from "@/pages/UserPage";
import { LoginPage } from "@/pages/LoginPage";
import { AuthenticatedLayout } from "./AuthenticatedLayout";
import { RequireAuth } from "./RequireAuth";
import { LoadingScreen } from "./LoadingScreen";

// Page components
const Home = () => <RegisterStepsPage />;
const User = () => <UserPage />;
const Team = () => <div>Team Page</div>;
const Leaderboard = () => <div>Leaderboard</div>;

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
