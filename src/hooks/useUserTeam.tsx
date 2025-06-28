import { TeamService } from "@/services/TeamService";
import type { QueryResult } from "@/types/QueryResult";
import type { Team } from "@/types/Team";
import { useCallback, useEffect, useState } from "react";

export const useUserTeam = (): QueryResult<Team | null> => {
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearCache, setClearCache] = useState<() => void>(() => () => {});

  const fetchUserTeam = useCallback(
    async (isRefetch = false) => {
      if (isRefetch && clearCache) {
        clearCache();
      }

      setLoading(true);

      try {
        const result = await TeamService.getTeamByUserId();

        // Set clear cache function if provided
        if (result.clearCache) {
          setClearCache(() => result.clearCache);
        }

        // Handle successful result
        if (result.success && result.data) {
          setUserTeam(result.data);
        } else {
          console.error("Failed to load user team:", result.error);
          setUserTeam(null);
        }
      } catch (error) {
        console.error("Error fetching user team:", error);
        setUserTeam(null);
      } finally {
        setLoading(false);
      }
    },
    [clearCache]
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchUserTeam();
  }, [fetchUserTeam]);

  const refetch = useCallback(() => {
    fetchUserTeam(true);
  }, [fetchUserTeam]);

  return {
    refetch,
    set: setUserTeam,
    data: userTeam,
    loading,
  };
};
