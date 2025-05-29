import "./App.css";
import Login from "./components/Login";
import { AuthProvider } from "./context/auth/AuthContextProvider";
import { SupabaseProvider } from "./context/supabase/SupabaseContextProvider";

function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </SupabaseProvider>
  );
}

export default App;
