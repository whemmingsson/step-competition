import supabase from "@/supabase";
import { LocalStorageService } from "./LocalStorageService";
import CacheService from "./CacheService";
import type { ProfileMeta } from "@/types/ProfileMeta";
import type { StepsRecord } from "@/types/StepsRecord";

import { wrapWithCache } from "@/utils/CacheWrapper";
import type { ExecutorResult } from "@/types/apiExecutorTypes";
import type { ServiceCallResult } from "@/types/ServiceCallResult";

/**
 * Service for handling step-related database operations
 */
export class StepService {
  /**
   * Clear the cache for all step-related data
   */
  private static clearServiceCache() {
    CacheService.invalidate("step_service_");
  }
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
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

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

      this.clearServiceCache();

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
   * @param groupByDate - Whether to group steps by date (default true)
   * @returns Promise with the user's step data
   */
  static async getUserSteps(uid: string, groupByDate: boolean = true) {
    // Only apply the competition filter if we have a value
    const competitionId = LocalStorageService.getSelectedComptetionId();

    try {
      const cacheKey = `step_service_user_steps_${uid}_${competitionId}`;
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

      // Fetch all step data for the user
      let query = supabase().from("Steps").select("*").eq("user_id", uid);

      if (competitionId) {
        query = query.eq("competition_id", competitionId);
      }

      // Execute the query to get all raw data
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (groupByDate) {
        // Group by date and sum steps
        const stepsByDay: Record<string, number> = {};

        data?.forEach((record) => {
          const date: string | null = record.date;
          if (typeof date === "string") {
            if (!stepsByDay[date]) {
              stepsByDay[date] = 0;
            }
            stepsByDay[date] += record.steps || 0;
          }
        });

        // Convert to array and sort by date descending
        const groupedData = Object.entries(stepsByDay)
          .map(([date, steps], i) => ({ date, steps, id: i }))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 7); // Get only the last 7 days

        CacheService.set(cacheKey, groupedData);

        return { success: true, data: groupedData };
      }

      // If not grouping by date, return raw data
      const rawData =
        data
          ?.map((record) => ({
            user_id: record.user_id,
            steps: record.steps,
            date: record.date ?? "",
            id: record.id,
          }))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 7) || [];

      CacheService.set(cacheKey, rawData);
      return { success: true, data: rawData };
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
    data?: {
      displayName: string;
      totalSteps: number;
      profileImageUrl: string;
    }[];
  }> {
    const competitionId = LocalStorageService.getSelectedComptetionId();

    if (!competitionId) {
      return {
        success: false,
        error: "No competition selected",
      };
    }

    // Read from cache first
    const cacheKey = `step_service_top_users_${competitionId}_${limit}`;
    const cachedData = CacheService.get(cacheKey);

    if (cachedData) {
      return {
        success: true,
        data: cachedData as {
          displayName: string;
          totalSteps: number;
          profileImageUrl: string;
        }[],
      };
    }

    try {
      // Get all steps records
      const { data: stepsData, error: stepsError } = await supabase()
        .from("Steps")
        .select("user_id, steps, Users_Meta(display_name, profile_image_url)")
        .eq("competition_id", competitionId);

      if (stepsError) {
        throw stepsError;
      }

      const userTotals: Record<string, ProfileMeta> = {};
      for (const record of stepsData) {
        const userId = record.user_id;

        if (!userId) {
          console.warn("Skipping record with missing user_id:", record);
          continue; // Skip records without user_id
        }
        if (!userTotals[userId]) {
          const profileMeta: ProfileMeta = {
            profileName: record.Users_Meta?.display_name || "Unknown User",
            profileImageUrl: record.Users_Meta?.profile_image_url || "",
            totalSteps: 0,
          };
          userTotals[userId] = profileMeta;
        }
        if (!userTotals[userId].totalSteps) {
          userTotals[userId].totalSteps = 0;
        }
        userTotals[userId].totalSteps += record.steps ?? 0;
      }

      // Sort users by total steps and take top ones
      const sortedUsers = Object.entries(userTotals)
        .map(([userId, profileMeta]) => ({ userId, profileMeta }))
        .sort(
          (a, b) =>
            (b.profileMeta.totalSteps as number) -
            (a.profileMeta.totalSteps as number)
        )
        .slice(0, limit);

      // Map to final result format
      const result = sortedUsers.map(({ profileMeta }) => ({
        displayName: profileMeta.profileName || "Unknown User",
        totalSteps: profileMeta.totalSteps || 0,
        profileImageUrl: profileMeta.profileImageUrl || "",
      }));

      CacheService.set(cacheKey, result, 5);

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
  static async deleteStepRecordsOnDate(
    date: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!date) {
        return {
          success: false,
          error: "Record date is required",
        };
      }

      const user = await supabase().auth.getUser();
      if (!user.data.user) {
        return {
          success: false,
          error: "User not authenticated",
        };
      }

      const { error } = await supabase()
        .from("Steps")
        .delete()
        .eq("date", date)
        .eq("user_id", user.data.user.id)
        .eq(
          "competition_id",
          LocalStorageService.getSelectedComptetionId() ?? -1 // Use a default invalid ID if null
        );

      if (error) {
        console.error("Error deleting step record(s):", error);
        return {
          success: false,
          error: error.message,
        };
      }

      this.clearServiceCache();

      return {
        success: true,
      };
    } catch (err) {
      console.error("Unexpected error deleting step record(s):", err);
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
  ): Promise<ServiceCallResult<number>> {
    const competitionId = LocalStorageService.getSelectedComptetionId();

    const cacheKey = `step_service_total_steps_${competitionId}_${ids.join(
      ","
    )}`;
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

  static async getTotalSteps(
    competetionId: number
  ): Promise<ExecutorResult<number>> {
    return await wrapWithCache(
      `step_service_total_steps_${competetionId}`,
      10,
      async () => {
        const { data, error } = await supabase()
          .from("Steps")
          .select("steps")
          .eq("competition_id", competetionId);

        if (error) {
          console.error("Error fetching total steps:", error);
          return {
            success: false,
            error: error,
          };
        }

        const result =
          data?.reduce((total, record) => total + (record.steps || 0), 0) || 0;

        return {
          success: true,
          data: result,
        };
      }
    );
  }

  static async getAllStepRecordsForCompetition(competetionId: number) {
    const cacheKey = `step_service_all_steps_${competetionId}`;
    const cachedData = CacheService.get(cacheKey);
    if (cachedData) {
      return {
        success: true,
        data: cachedData as { user_id: string; steps: number; date: string }[],
      };
    }

    try {
      const { data, error } = await supabase()
        .from("Steps")
        .select("*")
        .eq("competition_id", competetionId);

      if (error) {
        console.error("Error fetching all step records:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      CacheService.set(cacheKey, data, 10);

      return {
        success: true,
        data: (data as StepsRecord[]) || [],
      };
    } catch (err) {
      console.error("Unexpected error fetching all step records", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  static async updateStepRecord(recordId: number, steps: number) {
    const user = await supabase().auth.getUser();
    if (!user.data.user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    try {
      const { error } = await supabase()
        .from("Steps")
        .update({ steps: steps })
        .eq("id", recordId)
        .eq("user_id", user.data.user.id);

      if (error) {
        console.error("Error updating step record:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      this.clearServiceCache();

      return {
        success: true,
      };
    } catch (err) {
      console.error("Unexpected error updating step record:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }
}
