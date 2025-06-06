import CacheService from "@/services/CacheService";
import { TeamService } from "@/services/TeamService";
import type { QueryResult } from "@/types/QueryResult";
import type { Team } from "@/types/Team";
import { useEffect, useState } from "react";

export const useTeams = (): QueryResult<Team[]> => {
  const [ping, setPing] = useState<Date | null>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);

      const result = await TeamService.getTeams();

      if (result.success && result.data) {
        setTeams(result.data);
      } else {
        console.error("Failed to load teams:", result.error);
      }
      setLoading(false);
    };

    fetchTeams();
  }, [ping]);

  return {
    refetch: () => {
      CacheService.invalidate(`get-teams`);
      setPing(new Date());
    },
    data: teams,
    loading,
  };
};
