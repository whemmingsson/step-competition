import { CompetitionService } from "@/services/CompetitionService";
import { LocalStorageService } from "@/services/LocalStorageService";
import type { Competition } from "@/types/Competition";
import { useEffect, useState } from "react";

export const useCompetition = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [competition, setCompetition] = useState<Competition>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedCompetitionId = LocalStorageService.getSelectedComptetionId();

  useEffect(() => {
    async function fetchCompetitions() {
      setIsLoading(true);
      const result = await CompetitionService.getCompetitions();

      if (result.success && result.data) {
        setCompetitions(result.data as Competition[]);
      } else {
        console.error("Failed to fetch competition:", result.error);
      }

      setIsLoading(false);
    }

    fetchCompetitions();
  }, []);

  useEffect(() => {
    if (selectedCompetitionId) {
      const selectedCompetition = competitions.find(
        (comp) => comp.id === selectedCompetitionId.toString()
      );
      setCompetition(selectedCompetition);
    } else {
      setCompetition(undefined);
    }
  }, [competitions, selectedCompetitionId]);

  return {
    competition,
    isLoading,
    competitionId: selectedCompetitionId?.toString() || "",
  };
};
