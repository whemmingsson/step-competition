import supabase from "@/supabase";
import type { Team } from "@/types/Team";
import { StepService } from "./StepService";
import CacheService from "./CacheService";

/**
 * Service for user-related operations
 */
export class TeamService {
  private static async getTotalStepsForTeam(
    userIdsInTeam: string[]
  ): Promise<number> {
    const cacheKey = `get-total-steps-for-team-${userIdsInTeam.join(",")}`;
    const cachedSteps = CacheService.get(cacheKey);
    if (cachedSteps) {
      return cachedSteps as number; // Return cached value if available
    }

    const result = await StepService.getTotalStepsForListOfUsers(userIdsInTeam);
    if (!result.success) {
      console.error("Error fetching total steps for team:", result.error);
      return 0; // Return 0 if there's an error
    }

    // Cache the result for future use
    CacheService.set(cacheKey, result.data || 0, 10);

    return result.data || 0; // Return the total steps or 0 if data is undefined
  }
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
            members: [], // Initialize with an empty array, can be populated later,
            totalSteps: 0,
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
    const cacheKey = `get-teams`;
    const cachedTeams = CacheService.get(cacheKey);
    if (cachedTeams) {
      return { success: true, data: cachedTeams as Team[] };
    }

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

      // Cache the result
      CacheService.set(cacheKey, mappedData, 5);

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

      const cacheKey = `get-team-by-id-${teamId}`;
      const cachedTeam = CacheService.get(cacheKey);
      if (cachedTeam) {
        return { success: true, data: cachedTeam as Team };
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
            totalSteps: await this.getTotalStepsForTeam(
              (usersInTeamData ?? [])
                .map((member) => member.user_id)
                .filter((id) => id !== null)
            ),
          }
        : null;

      // Cache the result
      CacheService.set(cacheKey, mappedData, 15);

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
    const cacheKey = `get-team-by-user-id`;
    const cachedTeam = CacheService.get(cacheKey);
    if (cachedTeam) {
      return { success: true, data: cachedTeam as Team };
    }

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
            totalSteps: await this.getTotalStepsForTeam(
              (teamData?.members ?? []).map((member) => member.id)
            ),
          }
        : null;

      // Cache the result
      CacheService.set(cacheKey, mappedData, 15);

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

  static async getTopTeams(
    take: number
  ): Promise<{ success: boolean; error?: string; data?: Team[] }> {
    try {
      const cacheKey = `get-top-teams-${take}`;
      const cachedTeams = CacheService.get(cacheKey);
      if (cachedTeams) {
        return { success: true, data: cachedTeams as Team[] };
      }

      if (!take || take <= 0) {
        return { success: false, error: "Invalid number of teams to fetch" };
      }

      const { data, error } = await supabase()
        .from("Teams")
        .select("id, name, user_id");

      if (error) {
        console.error("Error fetching top teams:", error);
        return { success: false, error: error.message };
      }

      const mappedData: Team[] =
        data?.map((team) => ({
          id: team.id,
          name: team.name ?? "",
          user_id: team.user_id ?? "",
          members: [], // Initialize with an empty array, can be populated later
          totalSteps: 0, // Placeholder for total steps
        })) ?? [];

      // Fetch total steps for each team
      for (const team of mappedData) {
        const usersInTeam = await supabase()
          .from("Users_Teams")
          .select("user_id")
          .eq("team_id", team.id);

        if (usersInTeam.error) {
          console.error(
            `Error fetching users in team ${team.id}:`,
            usersInTeam.error
          );
          continue;
        }

        const userIds = usersInTeam.data
          .map((user) => user.user_id)
          .filter((id): id is string => id !== null);
        team.totalSteps = await this.getTotalStepsForTeam(userIds);
        team.members = userIds.map((id) => ({
          id,
          displayName: "UNSET", // Not relevant for this operation
        }));
        team.avgSteps = team.totalSteps / userIds.length || 0; // Calculate average steps
      }

      // Sort teams by total steps and limit to the requested number
      mappedData.sort((a, b) => (b.totalSteps || 0) - (a.totalSteps || 0));
      mappedData.splice(take);

      // Cache the result
      CacheService.set(cacheKey, mappedData, 20);

      return { success: true, data: mappedData };
    } catch (err) {
      console.error("Unexpected error fetching top teams:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }
}
