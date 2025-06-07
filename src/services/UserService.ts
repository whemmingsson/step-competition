import supabase from "@/supabase";
import type { User } from "@/types/User";
import CacheService from "./CacheService";

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

        // Cache the new display name
        const cacheKey = `display_name_${userId}`;
        CacheService.set(cacheKey, displayName, 60);

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

        // Cache the new display name
        const cacheKey = `display_name_${userId}`;
        CacheService.set(cacheKey, displayName, 60);

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

      const cacheKey = `display_name_${userId}`;
      const cachedData = CacheService.get(cacheKey);

      if (cachedData) {
        return {
          success: true,
          displayName: cachedData as string,
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

      const displayName =
        data && data["display_name"] !== null
          ? data["display_name"]
          : undefined;

      if (displayName) {
        CacheService.set(cacheKey, displayName, 60);
      }

      return {
        success: true,
        displayName: displayName,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  static async getUser(): Promise<{ success: boolean; user: User | null }> {
    try {
      const cacheKey = "current_user";
      const cachedUser = CacheService.get<User>(cacheKey);

      if (cachedUser) {
        return {
          success: true,
          user: cachedUser,
        };
      }

      const { data, error } = await supabase().auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return { success: false, user: null };
      }

      if (!data.user) {
        return { success: false, user: null };
      }

      const displayNameResult = await this.getDisplayName(data.user.id);

      const user: User = {
        id: data.user.id,
        displayName: displayNameResult.displayName ?? null,
      };

      CacheService.set(cacheKey, user, 60);

      return { success: true, user };
    } catch (err) {
      console.error("Unexpected error fetching user:", err);
      return {
        success: false,
        user: null,
      };
    }
  }
}
