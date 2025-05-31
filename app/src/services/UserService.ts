import supabase from "@/supabase";

/**
 * Service for user-related operations
 */
export class UserService {
  /**
   * Update a user's display name
   *
   * @param userId - The user's ID
   * @param displayName - The preferred username to set
   * @returns Promise with the result of the operation
   */
  static async setDisplayName(
    userId: string,
    displayName: string
  ): Promise<{ success: boolean; error?: string; data?: unknown }> {
    try {
      if (!userId || !displayName.trim()) {
        return {
          success: false,
          error: userId
            ? "Display name cannot be empty"
            : "User ID is required",
        };
      }

      const existingDisplayName = await this.getDisplayName(userId);

      if (existingDisplayName.success && existingDisplayName.displayName) {
        const { data, error } = await supabase()
          .from("Users_Meta")
          .update({ display_name: displayName })
          .eq("user_id", userId);

        if (error) {
          console.error("Error updating display name:", error);
          return { success: false, error: error.message };
        }

        return { success: true, data };
      } else {
        const { data: insertData, error: insertError } = await supabase()
          .from("Users_Meta")
          .insert([{ display_name: displayName, user_id: userId }])
          .select();

        if (insertError) {
          console.error("Error inserting display name:", insertError);
          return { success: false, error: insertError.message };
        }

        return { success: true, data: insertData };
      }
    } catch (err) {
      console.error("Unexpected error setting display name:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get a user's current display name
   *
   * @param userId - The user's ID
   * @returns Promise with the user's display name
   */
  static async getDisplayName(
    userId: string
  ): Promise<{ success: boolean; error?: string; displayName?: string }> {
    try {
      if (!userId) {
        return {
          success: false,
          error: "User ID is required",
        };
      }

      const { data, error } = await supabase()
        .from("Users_Meta")
        .select("display_name")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error getting display name:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        displayName:
          data && data["display_name"] !== null
            ? data["display_name"]
            : undefined,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }
}
