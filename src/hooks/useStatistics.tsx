import { StepService } from "@/services/StepService";
import { TeamService } from "@/services/TeamService";
import type { Statistics } from "@/types/Statistics";
import { useEffect, useState } from "react";

export const useStatistics = (competitionId: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Statistics | null>(null);

  useEffect(() => {
    const fetchStatisticsData = async () => {
      setIsLoading(true);
      const stepsData = await StepService.getAllStepRecordsForCompetition(
        competitionId
      );

      // Get all Teams regardless of competition
      const teamData = await TeamService.getTeams();

      if (stepsData.data && stepsData.data.length > 0) {
        const totalSteps = stepsData.data
          .map((r) => r.steps)
          .reduce((acc: number, record: number) => acc + record || 0, 0);

        const users = stepsData.data.map((r) => r.user_id);
        const uniqueUsersCount = new Set(users).size;
        const dates = stepsData.data.map((r) => r.date);
        const uniqueDatesCount = new Set(dates).size;

        // Create cumulative steps data
        const groupedByDate = stepsData.data.reduce((acc, record) => {
          const date = record.date;
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += record.steps;
          return acc;
        }, {} as Record<string, number>);

        const cumulativeSteps: Record<string, number> = {};

        let cumulativeTotal = 0;

        Object.keys(groupedByDate)
          .sort()
          .forEach((date) => {
            cumulativeTotal += groupedByDate[date];
            cumulativeSteps[date] = cumulativeTotal;
          });

        // Convert cumulative steps to array format
        const cumulativeStepsArray = Object.entries(cumulativeSteps).map(
          ([date, steps]) => ({
            date: date,
            steps: steps,
          })
        );

        let numberOfTeams = 0;
        let averageStepsPerTeam = null;
        if (teamData.success && teamData.data && teamData.data.length > 0) {
          // Filter teams that have members in the competition
          const filteredTeams = teamData.data.filter((team) =>
            team.memberIds?.some((memberId) =>
              stepsData.data.some((record) => record.user_id === memberId)
            )
          );
          numberOfTeams = filteredTeams.length;
          averageStepsPerTeam =
            numberOfTeams > 0 ? Math.round(totalSteps / numberOfTeams) : null;
        }

        // Prepare statistics object
        const statistics: Statistics = {
          totalSteps: totalSteps,
          averagePerMember: Math.round(totalSteps / uniqueUsersCount),
          averagePerDay: Math.round(totalSteps / uniqueDatesCount),
          averagePerDayAndMember: Math.round(
            totalSteps / (uniqueDatesCount * uniqueUsersCount)
          ),
          cumilativeSteps: cumulativeStepsArray,
          numberOfTeams: numberOfTeams,
          averageStepsPerTeam: averageStepsPerTeam,
        };

        setData(statistics);
      } else {
        console.error(
          "Failed to fetch statistics data: No steps records found."
        );
      }
      setIsLoading(false);
    };

    fetchStatisticsData();
  }, [competitionId]);

  return {
    data: data,
    isLoading: isLoading,
    error: null,
  };
};
