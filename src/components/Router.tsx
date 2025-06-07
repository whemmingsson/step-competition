import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import RegisterStepsPage from "@/pages/RegisterStepsPage";
import MyProgressPage from "@/pages/MyProgressPage";
import { LoginPage } from "@/pages/LoginPage";
import { Layout } from "./Layout";
import { RequireAuth } from "./RequireAuth";
import { LoadingScreen } from "./LoadingScreen";
import { LeaderboardPage } from "@/pages/LeaderboardPage.";
import { TeamPage } from "@/pages/TeamPage";
import { ProfilePage } from "@/pages/ProfilePage";

const pages = [
  { p: "/", c: <RegisterStepsPage /> },
  { p: "/user", c: <MyProgressPage /> },
  { p: "/team", c: <TeamPage /> },
  { p: "/leaderboard", c: <LeaderboardPage /> },
  { p: "/profile", c: <ProfilePage /> },
];

export const Router = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || "/"}>
      <Routes>
        {/* Login page - separate from other routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* All authenticated routes use the same layout */}
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            {pages.map((page) => (
              <Route key={page.p} path={page.p} element={page.c} />
            ))}
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
