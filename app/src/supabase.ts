import { createClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

const client = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const supabase = () => client;

export default supabase;
