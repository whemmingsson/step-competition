import supabase from "@/supabase";
import type { User } from "@/types/User";
import CacheService from "./CacheService";
import type { ProfileMeta } from "@/types/ProfileMeta";

/**
 * Service for user-related operations
 */
export class UserService {
  private static clearServiceCache(): void {
    // Clear all user-related cache entries
    CacheService.invalidate("user_service_");
  }

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

      const profileMeta = await this.getProfileMeta(userId);
      const hasMetaData = profileMeta.success && profileMeta.data;

      if (hasMetaData) {
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

        this.clearServiceCache();

        // Cache the new display name
        const cacheKey = `user_service_display_name_${userId}`;
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
  static async getProfileMeta(
    userId: string
  ): Promise<{ success: boolean; error?: string; data?: ProfileMeta }> {
    try {
      if (!userId) {
        return {
          success: false,
          error: "User ID is required",
        };
      }

      const cacheKey = `user_service_profile_meta_${userId}`;
      const cachedData = CacheService.get(cacheKey);

      if (cachedData) {
        return {
          success: true,
          data: cachedData as ProfileMeta,
        };
      }

      const { data, error } = await supabase()
        .from("Users_Meta")
        .select("display_name, profile_image_url")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error getting profile meta:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      if (data) {
        CacheService.set(cacheKey, data as ProfileMeta, 60);
      }

      return {
        success: true,
        data: data as ProfileMeta,
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
      const cacheKey = "user_service_current_user";
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

      const meta = await this.getProfileMeta(data.user.id);

      const user: User = {
        id: data.user.id,
        displayName: meta.data?.display_name ?? null,
        profileImageUrl: meta.data?.profile_image_url ?? null,
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

  /**
   * Update a user's profile image URL
   *
   * @param userId - The user's ID
   * @param imageUrl - The URL of the uploaded profile image
   * @returns Promise with the result of the operation
   */
  static async setProfileImageUrl(
    userId: string,
    imageUrl: string
  ): Promise<{ success: boolean; error?: string; data?: unknown }> {
    try {
      console.log("Setting profile image URL for user:", userId, imageUrl);
      if (!userId || !imageUrl.trim()) {
        return {
          success: false,
          error: userId ? "Image URL cannot be empty" : "User ID is required",
        };
      }

      // Check if user exists in Users_Meta table
      const { data: existingUser, error: fetchError } = await supabase()
        .from("Users_Meta")
        .select("user_id, profile_image_url")
        .eq("user_id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "no rows returned" error
        console.error("Error checking for existing user:", fetchError);
        return { success: false, error: fetchError.message };
      }

      let result;

      if (existingUser) {
        // Update existing record
        const { data, error } = await supabase()
          .from("Users_Meta")
          .update({ profile_image_url: imageUrl })
          .eq("user_id", userId);

        console.log("Update result:", data, error);

        if (error) {
          console.error("Error updating profile image URL:", error);
          return { success: false, error: error.message };
        }

        result = { success: true, data };
      } else {
        // Insert new record
        const { data, error } = await supabase()
          .from("Users_Meta")
          .insert([
            {
              user_id: userId,
              profile_image_url: imageUrl,
              display_name: null, // Set to null or provide a default display name
            },
          ])
          .select();

        if (error) {
          console.error("Error inserting profile image URL:", error);
          return { success: false, error: error.message };
        }

        result = { success: true, data };
      }

      // Update user cache
      const userCacheKey = "user_service_current_user";
      const cachedUser = CacheService.get<User>(userCacheKey);

      if (cachedUser) {
        cachedUser.profileImageUrl = imageUrl;
        CacheService.set(userCacheKey, cachedUser, 60);
      }

      // Cache the image URL separately
      const imageCacheKey = `user_service_profile_image_${userId}`;
      CacheService.set(imageCacheKey, imageUrl, 60);

      return result;
    } catch (err) {
      console.error("Unexpected error setting profile image URL:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  static async getNumberOfUsersInCompetition(
    competitionId: number
  ): Promise<number> {
    try {
      // Get all user_id entries for the competition
      const { data, error } = await supabase()
        .from("Steps")
        .select("user_id")
        .eq("competition_id", competitionId)
        .gt("steps", 0);

      if (error) {
        console.error("Error fetching number of users in competition:", error);
        return 0;
      }

      // Count distinct users with Set
      if (!data || data.length === 0) return 0;

      const uniqueUserIds = new Set<string>();

      // Add each user_id to the Set (Sets only store unique values)
      data.forEach((record) => {
        if (record.user_id) {
          uniqueUserIds.add(record.user_id);
        }
      });

      return uniqueUserIds.size;
    } catch (err) {
      console.error(
        "Unexpected error fetching number of users in competition:",
        err
      );
      return 0;
    }
  }
}
