import supabase from "@/supabase";
import { LocalStorageService } from "./LocalStorageService";
import CacheService from "./CacheService";

/**
 * Service for handling step-related database operations
 */
export class StepService {
  /**
   * Insert a new step entry into the database
   *
   * @param steps - Number of steps recorded
   * @param uid - User ID of the person who recorded the steps
   * @param date - Date when the steps were taken
   * @returns Promise with the result of the insert operation
   */
  static async recordSteps(
    steps: number,
    uid: string,
    date: Date
  ): Promise<{ success: boolean; error?: string; data?: unknown }> {
    try {
      // Format the date to ISO string (YYYY-MM-DD) to ensure proper storage in Supabase
      const formattedDate = date.toISOString().split("T")[0];

      const { data, error } = await supabase()
        .from("Steps")
        .insert([
          {
            user_id: uid,
            steps: steps,
            date: formattedDate,
            competition_id: LocalStorageService.getSelectedComptetionId(),
          },
        ])
        .select();

      if (error) {
        console.error("Error recording steps:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      // Clear the cache for user steps since we just added a new record
      const cacheKey = `user_steps_${uid}_${LocalStorageService.getSelectedComptetionId()}`;
      CacheService.invalidate(cacheKey);

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.error("Unexpected error recording steps:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get steps for a specific user
   *
   * @param uid - User ID to fetch steps for
   * @returns Promise with the user's step data
   */
  static async getUserSteps(uid: string) {
    // Only apply the competition filter if we have a value
    const competitionId = LocalStorageService.getSelectedComptetionId();

    try {
      const cacheKey = `user_steps_${uid}_${competitionId}`;
      const cachedData = CacheService.get(cacheKey);
      if (cachedData) {
        return {
          success: true,
          data: cachedData as {
            user_id: string;
            steps: number;
            date: string;
          }[],
        };
      }

      // Start with the base query
      let query = supabase()
        .from("Steps")
        .select("*")
        .eq("user_id", uid)
        .order("date", { ascending: false })
        .limit(7);

      if (competitionId) {
        query = query.eq("competition_id", competitionId);
      }

      // Execute the query
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      CacheService.set(cacheKey, data);

      return { success: true, data };
    } catch (err) {
      console.error("Error fetching user steps:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get the top 5 users with the highest total steps
   *
   * @param limit - Number of users to return (default 5)
   * @returns Promise with array of {username, totalSteps}
   */
  static async getTopUsers(limit: number = 5): Promise<{
    success: boolean;
    error?: string;
    data?: { displayName: string; totalSteps: number }[];
  }> {
    const competitionId = LocalStorageService.getSelectedComptetionId();

    if (!competitionId) {
      return {
        success: false,
        error: "No competition selected",
      };
    }

    // Read from cache first
    const cacheKey = `top_users_${competitionId}_${limit}`;
    const cachedData = CacheService.get(cacheKey);

    if (cachedData) {
      return {
        success: true,
        data: cachedData as { displayName: string; totalSteps: number }[],
      };
    }

    try {
      // Get all steps records
      const { data: stepsData, error: stepsError } = await supabase()
        .from("Steps")
        .select("user_id, steps")
        .eq("competition_id", competitionId);

      if (stepsError) {
        throw stepsError;
      }

      // Group steps by user and calculate totals
      const userTotals: Record<string, number> = {};
      for (const record of stepsData) {
        const userId = record.user_id;

        if (!userId) {
          console.warn("Skipping record with missing user_id:", record);
          continue; // Skip records without user_id
        }
        if (!userTotals[userId]) {
          userTotals[userId] = 0;
        }
        userTotals[userId] += record.steps ?? 0;
      }

      // Sort users by total steps and take top ones
      const sortedUsers = Object.entries(userTotals)
        .map(([userId, totalSteps]) => ({ userId, totalSteps }))
        .sort((a, b) => (b.totalSteps as number) - (a.totalSteps as number))
        .slice(0, limit);

      // Fetch usernames for the top users
      const userIds = sortedUsers.map((user) => user.userId);
      const { data: usersData, error: usersError } = await supabase()
        .from("Users_Meta")
        .select("user_id, display_name")
        .in("user_id", userIds);

      // Convert the usersData to a map for easy access
      let userMetaMap: Record<string, string> = {};
      if (usersData) {
        userMetaMap = usersData.reduce((acc, user) => {
          if (user.user_id) {
            acc[user.user_id] = user.display_name || "Unknown User";
          }
          return acc;
        }, {} as Record<string, string>);
      }

      if (usersError) {
        throw usersError;
      }
      // Map usernames to the sorted users
      const result = [];
      for (const user of sortedUsers) {
        if (!user.userId) {
          console.warn("Skipping user with missing user_id:", user);
          continue; // Skip users without user_id
        }
        const username = userMetaMap[user.userId] || "Unknown User";
        result.push({
          displayName: username,
          totalSteps: user.totalSteps,
        });
      }

      CacheService.set(cacheKey, result, 10);

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      console.error("Error fetching top users:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Delete a specific step record
   *
   * @param id - ID of the step record to delete
   * @returns Promise with the result of the delete operation
   */
  static async deleteStepRecord(
    id: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!id) {
        return {
          success: false,
          error: "Record ID is required",
        };
      }

      const { error } = await supabase().from("Steps").delete().eq("id", id);

      if (error) {
        console.error("Error deleting step record:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (err) {
      console.error("Unexpected error deleting step record:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get total steps for a list of users
   *
   * @param ids - Array of user IDs to fetch total steps for
   * @returns Promise with the result of the operation
   */
  static async getTotalStepsForListOfUsers(
    ids: string[]
  ): Promise<{ success: boolean; error?: string; data?: number }> {
    const competitionId = LocalStorageService.getSelectedComptetionId();

    const cacheKey = `total_steps_${competitionId}_${ids.join(",")}`;
    const cachedData = CacheService.get(cacheKey);
    if (cachedData) {
      return {
        success: true,
        data: cachedData as number,
      };
    }

    try {
      if (!competitionId) {
        return {
          success: false,
          error: "No competition selected",
        };
      }
      if (!ids) {
        return {
          success: false,
          error: "Ids are required",
        };
      }

      const { data, error } = await supabase()
        .from("Steps")
        .select("steps")
        .in("user_id", ids)
        .eq("competition_id", competitionId);

      if (error) {
        console.error("Error fetching total steps for users:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      const result =
        data?.reduce((total, record) => total + (record.steps || 0), 0) || 0;

      CacheService.set(cacheKey, result, 10);

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      console.error("Unexpected error fetching total step count for team", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }
}
