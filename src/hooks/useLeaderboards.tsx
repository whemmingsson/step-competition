import { useState, useEffect, useCallback } from "react";
import { StepService } from "@/services/StepService";
import { TeamService } from "@/services/TeamService";

import type { LeaderboardUser } from "@/types/LeaderboardUser";
import type { Team } from "@/types/Team";

/**
 * Custom hook to fetch both user and team leaderboards
 *
 * @param limit - Number of entries to fetch for each leaderboard (default: 5)
 * @returns Object containing user and team leaderboard data, error states, loading state, and refetch function
 */
export const useLeaderboards = (limit: number = 5) => {
  // User leaderboard state
  const [userLeaderboard, setUserLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userError, setUserError] = useState<string | null>(null);

  // Team leaderboard state
  const [teamLeaderboard, setTeamLeaderboard] = useState<Team[]>([]);
  const [teamError, setTeamError] = useState<string | null>(null);

  // Shared loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch both leaderboards
   */
  const fetchLeaderboards = useCallback(async () => {
    setIsLoading(true);
    setUserError(null);
    setTeamError(null);

    // Use Promise.all to fetch both leaderboards in parallel
    await Promise.all([
      // Fetch user leaderboard
      (async () => {
        try {
          const result = await StepService.getTopUsers_v2(limit);

          if (result.success && result.data) {
            setUserLeaderboard(result.data as LeaderboardUser[]);
          } else {
            setUserError(
              result.error || "Failed to load user leaderboard data"
            );
          }
        } catch (err) {
          setUserError("An unexpected error occurred with user leaderboard");
          console.error("User leaderboard error:", err);
        }
      })(),

      // Fetch team leaderboard
      (async () => {
        try {
          const result = await TeamService.getTopTeams(limit);

          if (result.success && result.data) {
            const sorted = result.data.sort(
              (a, b) => (b?.avgSteps ?? 0) - (a?.avgSteps ?? 0)
            );
            setTeamLeaderboard(sorted);
          } else {
            setTeamError(
              result.error || "Failed to load team leaderboard data"
            );
          }
        } catch (err) {
          setTeamError("An unexpected error occurred with team leaderboard");
          console.error("Team leaderboard error:", err);
        }
      })(),
    ]);

    setIsLoading(false);
  }, [limit]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchLeaderboards();
  }, [fetchLeaderboards, limit]);

  return {
    userLeaderboard,
    teamLeaderboard,
    userError,
    teamError,
    isLoading,
    refetch: fetchLeaderboards,
  };
};
