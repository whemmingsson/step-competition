import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseContext } from "./SupabaseContext";
import { useEffect, useState, type ReactNode } from "react";
import type { Database } from "../../../database.types";

// Provider props type
interface SupabaseProviderProps {
  children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabaseClient, setSupabaseClient] = useState<
    SupabaseClient<Database> | undefined
  >();

  useEffect(() => {
    const supabase = createClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );

    setSupabaseClient(supabase);
  }, []);

  return (
    <SupabaseContext.Provider value={{ client: supabaseClient }}>
      {children}
    </SupabaseContext.Provider>
  );
}
