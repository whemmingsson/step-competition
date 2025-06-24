import supabase from "@/supabase";
import type { UserResponse } from "@supabase/supabase-js";

export const getAuthenticatedUser = async (): Promise<UserResponse> => {
  return await supabase().auth.getUser();
};
