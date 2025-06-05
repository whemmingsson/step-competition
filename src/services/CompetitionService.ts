import supabase from "@/supabase";
import CacheService from "./CacheService";
import type { Competition } from "@/types/Competition";

/**
 * Service for user-related operations
 */
export class CompetitionService {
  /**
   * Fetches the list of competitions from the database
   *
   * @returns Promise with the result of the operation
   */
  static async getCompetitions(): Promise<{
    success: boolean;
    error?: string;
    data?: Competition[];
  }> {
    try {
      const cacheKey = "competitions";
      const cachedData = CacheService.get(cacheKey);
      if (cachedData) {
        return {
          success: true,
          data: cachedData as Competition[],
        };
      }
      const { data, error } = await supabase()
        .from("Competitions")
        .select("name, id, start_date, end_date");

      if (error) {
        console.error("Error fetching competitions:", error);
        return { success: false, error: error.message };
      }

      const mappedData = data?.map((c) => {
        return {
          id: c.id.toString(),
          name: c.name,
          startDate: c.start_date,
          endDate: c.end_date,
        } as Competition;
      });

      if (mappedData) {
        // Cache the fetched data for 1 hour
        CacheService.set(cacheKey, mappedData, 60);
      }

      return { success: true, data: mappedData };
    } catch (err) {
      console.error("Unexpected error fetching competitions:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }
}
