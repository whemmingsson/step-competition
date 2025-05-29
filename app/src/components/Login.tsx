import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAuth } from "../context/auth/useAuth.tsx";
import { useSupabase } from "../context/supabase/useSupabase.tsx";

function Login() {
  const { session } = useAuth();
  const { client } = useSupabase();

  if (!client) {
    return <p>Supabase client not initilized...</p>;
  }

  if (!session) {
    return <Auth supabaseClient={client} appearance={{ theme: ThemeSupa }} />;
  } else {
    return <div>Logged in!</div>;
  }
}

export default Login;
