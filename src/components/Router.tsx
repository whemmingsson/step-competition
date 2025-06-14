import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

import { LoginPage } from "@/pages/LoginPage";
import { Layout } from "./Layout";
import { RequireAuth } from "./RequireAuth";
import { LoadingScreen } from "./LoadingScreen";
import { SitePages } from "@/navigation/NavigationConfig";

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
            {SitePages.map((page) => (
              <Route
                key={page.name}
                path={page.path}
                element={page.component}
              />
            ))}
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
