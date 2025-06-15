import { useState, useEffect, useCallback } from "react";
import { CompetitionService } from "@/services/CompetitionService";
import type { Competition } from "@/types/Competition"; // Adjust the type import as needed
import { useUser } from "@/context/user/UserContext";

/**
 * Hook to fetch competitions data
 *
 * @param userId - The user ID needed to fetch competitions
 * @returns Object containing competitions data, loading state, and a refetch function
 */
export function useCompetitions() {
  const { user } = useUser();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitions = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await CompetitionService.getCompetitions();

      if (result.success && result.data) {
        setCompetitions(result.data);
      } else {
        setError(result.error || "Failed to load competitions");
      }
    } catch (err) {
      console.error("Error fetching competitions:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions, user?.id]);

  return {
    competitions,
    loading,
    error,
    refetch: fetchCompetitions,
  };
}
