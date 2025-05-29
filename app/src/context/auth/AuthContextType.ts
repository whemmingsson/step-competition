import type { Session } from "@supabase/supabase-js";

export type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
};
