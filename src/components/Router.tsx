import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

import { LoginPage } from "@/pages/LoginPage";
import { Layout } from "./Layout";
import { RequireAuth } from "./RequireAuth";
import { LoadingScreen } from "./LoadingScreen";
import { SitePages } from "@/navigation/NavigationConfig";
import { PromoPage } from "@/pages/PromoPage";
import { CompetitionHandler } from "./CompetitionHandler";
import { InviteVerificationErrorPage } from "@/pages/InviteVerificationErrorPage";

export const Router = () => {
  const { isLoading } = useAuth();

  if (import.meta.env.VITE_SITE_ENABLED === "false") {
    return <PromoPage />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || "/"}>
      <CompetitionHandler>
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
          <Route path="/error" element={<InviteVerificationErrorPage />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CompetitionHandler>
    </BrowserRouter>
  );
};
