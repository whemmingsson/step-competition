import supabase from "@/supabase";
import type { Team } from "@/types/Team";

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
    data?: Team | null;
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

      const mappedData: Team | null = data
        ? {
            id: data.id,
            name: data.name ?? "",
            user_id: data.user_id ?? "",
            members: [], // Initialize with an empty array, can be populated later
          }
        : null;
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
    data?: Team[];
  }> {
    try {
      const { data, error } = await supabase()
        .from("Teams")
        .select("id, name, user_id");

      if (error) {
        console.error("Error fetching teams:", error);
        return { success: false, error: error.message };
      }

      const mappedData: Team[] =
        data?.map((team) => ({
          id: team.id,
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
    data?: Team | null;
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

      const { data: usersInTeamData, error: teamError } = await supabase()
        .from("Users_Teams")
        .select("user_id")
        .eq("team_id", teamId);

      if (teamError) {
        console.error("Error fetching users in team:", teamError);
        return { success: false, error: teamError.message };
      }

      const mappedData: Team | null = data
        ? {
            id: data.id,
            name: data.name ?? "",
            user_id: data.user_id ?? "",
            members:
              (usersInTeamData ?? [])
                .map((user) => {
                  return { id: user.user_id ?? "", displayName: "UNSET" };
                })
                .filter((id) => id !== null) || [],
          }
        : null;

      return { success: true, data: mappedData };
    } catch (err) {
      console.error("Unexpected error fetching team by ID:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  public static async getTeamByUserId(): Promise<{
    success: boolean;
    error?: string;
    data?: Team | null;
  }> {
    try {
      const user = await supabase().auth.getUser();
      if (!user || !user.data.user?.id) {
        return { success: false, error: "User not authenticated" };
      }

      // Check if the user is part of a team
      const { data, error } = await supabase()
        .from("Users_Teams")
        .select("id, user_id, team_id")
        .eq("user_id", user.data.user?.id)
        .single();

      if (error) {
        console.error("Error fetching team by user ID:", error);
        return { success: false, error: error.message };
      }

      if (!data || !data.team_id) {
        return { success: true, data: null }; // No team found for user
      }

      // Get team details
      const { data: teamData, error: teamError } = await this.getTeamById(
        data.team_id
      );

      if (teamError) {
        console.error("Error fetching team details:", teamError);
        return { success: false, error: teamError };
      }

      const mappedData: Team | null = teamData
        ? {
            id: teamData.id,
            name: teamData.name ?? "",
            user_id: teamData.user_id ?? "",
            members: teamData.members || [],
          }
        : null;

      return { success: true, data: mappedData };
    } catch (err) {
      console.error("Unexpected error fetching team by user ID:", err);
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

  /**
   * Leave a team
   *
   * @param userId - The ID of the user leaving the team
   * @param teamId - The ID of the team to leave
   * @returns Promise with the result of the operation
   */
  static async leaveTeam(
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
        .delete()
        .eq("user_id", userId)
        .eq("team_id", teamId);

      if (error) {
        console.error("Error leaving team:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected error leaving team:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }
}
