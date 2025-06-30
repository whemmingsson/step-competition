import supabase from "@/supabase";
import type { Team } from "@/types/Team";
import { StepService } from "./StepService";
import CacheService from "./CacheService";
import { getAuthenticatedUser } from "@/utils/AuthUtils";
import { wrapWithCache } from "@/utils/CacheWrapper";
import { executeQuery } from "./SupabaseApiService";
import type { ServiceQueryResult } from "@/types/ServiceQueryResult";
import type { TeamDTO } from "@/types/DTO/TeamDTO";
import {
  teamsTransformer,
  teamTransformer,
  topTeamsToTeamsTransformer,
  topTeamsTransformer,
} from "@/services/Transformers";
import { LocalStorageService } from "./LocalStorageService";
import type { ServiceMutationResult } from "@/types/ServiceMutationResult";

/**
 * Service for user-related operations
 */
export class TeamService {
  private static async getTotalStepsForTeam(
    userIdsInTeam: string[]
  ): Promise<number> {
    return await wrapWithCache<number, number>(
      `team_service_get-total-steps-for-team-${userIdsInTeam.join(",")}`,
      5,
      async () => {
        return await StepService.getTotalStepsForListOfUsers(userIdsInTeam);
      }
    );
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
  ): Promise<ServiceQueryResult<Team | null>> {
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

      CacheService.invalidate(`team_service_get-teams`);

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
  static async getTeams(): Promise<ServiceQueryResult<Team[]>> {
    const cacheKey = `teams_service_get-teams`;

    return await executeQuery<Team[], TeamDTO[]>(
      async () => {
        return await supabase().from("Teams").select(`
          id, 
          name, 
          user_id,
          Users_Teams(user_id)
      `);
      },
      teamsTransformer,
      cacheKey,
      5
    );
  }

  public static async getTeamById(
    teamId: number
  ): Promise<ServiceQueryResult<Team>> {
    const cacheKey = `team_service_get-team-by-id-${teamId}`;

    const { data: mappedTeam } = await executeQuery<Team, TeamDTO>(
      async () => {
        return await supabase()
          .from("Teams")
          .select("id, name, user_id, Users_Teams(user_id)")
          .eq("id", teamId)
          .single();
      },
      teamTransformer,
      cacheKey,
      5
    );

    if (!mappedTeam) {
      return { success: false, error: "Failed to map team data" };
    }

    // This is a an extra transformation step to get the total steps for the team
    // The result from this operation is cached for 5 minutes
    mappedTeam.totalSteps = await this.getTotalStepsForTeam(
      (mappedTeam.memberIds ?? [])
        .map((member) => member)
        .filter((id) => id !== null)
    );

    return { success: true, data: mappedTeam };
  }

  public static async getTeamByUserId(): Promise<ServiceQueryResult<Team>> {
    const cacheKey = `team_service_get-team-by-user-id`;
    const cachedTeam = CacheService.get(cacheKey);
    if (cachedTeam) {
      return { success: true, data: cachedTeam as Team };
    }

    try {
      const user = await getAuthenticatedUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // Check if the user is part of a team
      const { data, error } = await supabase()
        .from("Users_Teams")
        .select("id, user_id, team_id")
        .eq("user_id", user.id)
        .single();

      if (error && error.code === "PGRST116" && !data) {
        return { success: false, error: "No team found for user" };
      }

      if (error || !data || !data.team_id) {
        console.error("Error fetching team by user ID:", error);
        return {
          success: false,
          error: error?.message || "No team found for user",
        };
      }

      // Get team details
      const { data: teamData, error: teamError } = await this.getTeamById(
        data.team_id
      );

      if (teamError) {
        console.error("Error fetching team details:", teamError);
        return { success: false, error: teamError };
      }

      const mappedData = teamData;

      // Cache the result
      CacheService.set(cacheKey, mappedData);

      return {
        success: true,
        data: mappedData as Team,
        clearCache: () => CacheService.invalidate(cacheKey),
      };
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
  ): Promise<ServiceMutationResult> {
    try {
      if (!userId || !teamId) {
        return {
          success: false,
          error: userId ? "Team ID is required" : "User ID is required",
        };
      }

      const { error } = await supabase()
        .from("Users_Teams")
        .insert([{ user_id: userId, team_id: teamId }]);

      if (error) {
        console.error("Error joining team:", error);
        return { success: false, error: error.message };
      }

      // Clear cache for this team
      CacheService.invalidate(`team_service_get-team-by-id-${teamId}`);
      CacheService.invalidate(`team_service_get-team-by-user-id`);
      CacheService.invalidate(`team_service_get-teams`);
      CacheService.invalidate(`team_service_get-top-teams-`);

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
  ): Promise<ServiceMutationResult> {
    try {
      if (!userId || !teamId) {
        return {
          success: false,
          error: userId ? "Team ID is required" : "User ID is required",
        };
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

      // Clear cache for this team
      CacheService.invalidate(`team_service_get-team-by-id-${teamId}`);
      CacheService.invalidate(`team_service_get-team-by-user-id`);
      CacheService.invalidate(`team_service_get-teams`);
      CacheService.invalidate(`team_service_get-top-teams-`);

      return { success: true };
    } catch (err) {
      console.error("Unexpected error leaving team:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  static async getTopTeams_v2(
    limit: number
  ): Promise<ServiceQueryResult<Team[]>> {
    try {
      if (!limit || limit <= 0) {
        return { success: false, error: "Invalid number of teams to fetch" };
      }

      const { data, error } = await executeQuery(
        async () => {
          return await supabase().rpc("get_top_teams", {
            p_competition_id:
              LocalStorageService.getSelectedComptetionId() ?? -1,
            p_limit: limit,
          });
        },
        topTeamsTransformer,
        `team_service_get-top-teams-${limit}`,
        5
      );

      if (!data || error) {
        console.error("Error fetching top teams:", error);
        return { success: false, error: error || "Failed to fetch teams" };
      }

      return { success: true, data: topTeamsToTeamsTransformer(data) };
    } catch (err) {
      console.error("Unexpected error fetching top teams:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }

  static async deleteTeam(
    teamId: number,
    userId: string
  ): Promise<ServiceMutationResult> {
    try {
      if (!teamId || !userId) {
        return { success: false, error: "Team ID and User ID are required" };
      }

      // Check if the user is the owner of the team
      const { data: teamData, error: teamError } = await supabase()
        .from("Teams")
        .select("user_id")
        .eq("id", teamId)
        .single();

      if (teamError || !teamData) {
        console.error("Error fetching team data:", teamError);
        return { success: false, error: "Team not found" };
      }

      if (teamData.user_id !== userId) {
        return {
          success: false,
          error: "Only the team owner can delete the team",
        };
      }

      // Delete the team
      const { error } = await supabase()
        .from("Teams")
        .delete()
        .eq("id", teamId);

      if (error) {
        console.error("Error deleting team:", error);
        return { success: false, error: error.message };
      }

      // Clear cache for this team
      CacheService.invalidate(`team_service_get-team-by-id-${teamId}`);
      CacheService.invalidate(`team_service_get-teams`);

      return { success: true };
    } catch (err) {
      console.error("Unexpected error deleting team:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  }
}
