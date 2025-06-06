import { TeamService } from "@/services/TeamService";
import type { QueryResult } from "@/types/QueryResult";
import type { Team } from "@/types/Team";
import { useEffect, useState } from "react";

export const useUserTeam = (): QueryResult<Team | null> => {
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTeam = async () => {
      setLoading(true);

      const result = await TeamService.getTeamByUserId();
      if (result.success && result.data) {
        setUserTeam(result.data);
      } else {
        console.error("Failed to load user team:", result.error);
      }
      setLoading(false);
    };
    fetchUserTeam();
  }, []);

  return {
    set: setUserTeam,
    data: userTeam,
    loading,
  };
};
