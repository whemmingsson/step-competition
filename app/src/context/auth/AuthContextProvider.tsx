import type { Session } from "@supabase/supabase-js";
import { useSupabase } from "../supabase/useSupabase";
import { AuthContext } from "./AuthContext";
import { useEffect, useState, type ReactNode } from "react";

// Provider props type
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { client } = useSupabase();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!client) {
      console.error("Supabase client is not initialized.");
      return;
    }
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, [client]);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
}
