import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAuth } from "../context/auth/useAuth.tsx";
import supabase from "@/supabase.ts";
import { Navigate } from "react-router-dom";

function Login() {
  const { session } = useAuth();
  const client = supabase();

  if (!client) {
    return <p>Supabase client not initilized...</p>;
  }

  if (!session) {
    return (
      <Auth
        supabaseClient={client}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
      />
    );
  } else {
    return <Navigate to="/" />;
  }
}

export default Login;
