import supabase from "@/supabase";

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
    try {
      const { data, error } = await supabase()
        .from("Steps")
        .select("*")
        .eq("user_id", uid)
        .order("date", { ascending: false });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (err) {
      console.error("Error fetching user steps:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }
}
