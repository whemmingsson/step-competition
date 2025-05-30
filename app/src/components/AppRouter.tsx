import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import Login from "../components/Login";
import RegisterStepsPage from "@/pages/RegisterStepsPage";

// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
  </div>
);

// Placeholder components for your routes
const Home = () => <RegisterStepsPage />;
const User = () => <div>User Profile</div>;
const Team = () => <div>Team Page</div>;
const Leaderboard = () => <div>Leaderboard</div>;

const Layout = () => {
  return (
    <div className="flex-container">
      <div className="card-wrapper">
        <Outlet />
      </div>
    </div>
  );
};

// Protected layout component with loading state
const ProtectedLayout = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <Layout />;
};

export const AppRouter = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={session ? <Home /> : <Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/user" element={<User />} />
          <Route path="/team" element={<Team />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
