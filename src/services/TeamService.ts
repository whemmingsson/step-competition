import supabase from "@/supabase";

/**
 * Service for user-related operations
 */
export class TeamService {
  /**
   * Create a new team
   *
   * @param userId - The ID of the user creating the team
   * @param name - The name of the team
   * @returns Promise with the result of the operation
   */
  static async createTeam(
    userId: string,
    name: string
  ): Promise<{
    success: boolean;
    error?: string;
    data?:
      | {
          id: string;
          name: string;
          user_id: string;
        }
      | undefined;
  }> {
    try {
      if (!userId || !name.trim()) {
        return {
          success: false,
          error: userId ? "Team name cannot be empty" : "User ID is required",
        };
      }

      const { data, error } = await supabase()
        .from("Teams")
        .insert([{ name, user_id: userId }])
        .select()
        .single();

      if (error) {
        console.error("Error creating team:", error);
        return { success: false, error: error.message };
      }

      const mappedData = data
        ? {
            id: String(data.id),
            name: data.name ?? "",
            user_id: data.user_id ?? "",
          }
        : undefined;
      return { success: true, data: mappedData };
    } catch (err) {
      console.error("Unexpected error creating team:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Fetch all teams
   *
   * @returns Promise with the result of the operation
   */
  static async getTeams(): Promise<{
    success: boolean;
    error?: string;
    data?: { id: string; name: string; user_id: string }[];
  }> {
    try {
      const { data, error } = await supabase()
        .from("Teams")
        .select("id, name, user_id");

      if (error) {
        console.error("Error fetching teams:", error);
        return { success: false, error: error.message };
      }

      const mappedData =
        data?.map((team) => ({
          id: String(team.id),
          name: team.name ?? "",
          user_id: team.user_id ?? "",
        })) ?? [];
      return { success: true, data: mappedData };
    } catch (err) {
      console.error("Unexpected error fetching teams:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  public static async getTeamById(teamId: number): Promise<{
    success: boolean;
    error?: string;
    data?: { id: string; name: string; user_id: string };
  }> {
    try {
      if (!teamId) {
        return { success: false, error: "Team ID is required" };
      }

      const { data, error } = await supabase()
        .from("Teams")
        .select("id, name, user_id")
        .eq("id", teamId)
        .single();

      if (error) {
        console.error("Error fetching team by ID:", error);
        return { success: false, error: error.message };
      }

      const mappedData = data
        ? {
            id: String(data.id),
            name: data.name ?? "",
            user_id: data.user_id ?? "",
          }
        : undefined;

      return { success: true, data: mappedData };
    } catch (err) {
      console.error("Unexpected error fetching team by ID:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Join a team
   *
   * @param userId - The ID of the user joining the team
   * @param teamId - The ID of the team to join
   * @returns Promise with the result of the operation
   */
  static async joinTeam(
    userId: string,
    teamId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!userId || !teamId) {
        return {
          success: false,
          error: userId ? "Team ID is required" : "User ID is required",
        };
      }

      // check if the team exists
      const result = await this.getTeamById(teamId);
      if (!result.success || !result.data) {
        return { success: false, error: "Team not found" };
      }

      const { error } = await supabase()
        .from("Users_Teams")
        .insert([{ user_id: userId, team_id: teamId }]);

      if (error) {
        console.error("Error joining team:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected error joining team:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }
}
