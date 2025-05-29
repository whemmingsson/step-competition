import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAuth } from "../context/auth/useAuth.tsx";
import { Button } from "./ui/button.tsx";
import supabase from "@/supabase.ts";

function Login() {
  const { session } = useAuth();
  const client = supabase();

  if (!client) {
    return <p>Supabase client not initilized...</p>;
  }

  if (!session) {
    return <Auth supabaseClient={client} appearance={{ theme: ThemeSupa }} />;
  } else {
    return (
      <div>
        {" "}
        <div className="flex flex-col items-center justify-center min-h-svh">
          <Button>Click me</Button>
        </div>
      </div>
    );
  }
}

export default Login;
