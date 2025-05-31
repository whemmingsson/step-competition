import supabase from "@/supabase";

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
    data?: { name: string | null; id: number }[];
  }> {
    try {
      const { data, error } = await supabase()
        .from("Competitions")
        .select("name, id");

      if (error) {
        console.error("Error fetching competitions:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (err) {
      console.error("Unexpected error fetching competitions:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }
}
