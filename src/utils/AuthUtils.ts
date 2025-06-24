import supabase from "@/supabase";
import type { User } from "@supabase/supabase-js";

export const getAuthenticatedUser = async (): Promise<User> => {
  const userResponse = await supabase().auth.getUser();
  if (userResponse.error) {
    console.error("Error fetching authenticated user:", userResponse.error);
    throw new Error(
      userResponse.error.message || "Failed to fetch authenticated user"
    );
  }

  return userResponse.data.user;
};
