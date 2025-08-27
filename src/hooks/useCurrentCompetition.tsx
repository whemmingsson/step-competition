import { CompetitionService } from "@/services/CompetitionService";
import { LocalStorageService } from "@/services/LocalStorageService";
import type { Competition } from "@/types/Competition";
import { useEffect, useState } from "react";

export const useCurrentCompetition = () => {
  const [competition, setCompetition] = useState<Competition>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const selectedCompetitionId = LocalStorageService.getSelectedCompetitionId();

  useEffect(() => {
    async function fetchCompetition() {
      if (!selectedCompetitionId) {
        setCompetition(undefined);
        return;
      }

      setIsLoading(true);
      const result = await CompetitionService.getCompetitionById(
        selectedCompetitionId.toString()
      );

      if (result.success && result.data) {
        setCompetition(result.data as Competition);
      } else {
        console.error("Failed to fetch competition:", result.error);
        setCompetition(undefined);
      }

      setIsLoading(false);
    }

    fetchCompetition();
  }, [selectedCompetitionId]);

  return {
    competition,
    isLoading,
    competitionId: selectedCompetitionId?.toString() || "",
  };
};
