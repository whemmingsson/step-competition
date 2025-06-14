import { StepService } from "@/services/StepService";
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

        const cumulativeStepsArray = Object.entries(cumulativeSteps).map(
          ([date, steps]) => ({
            date: date,
            steps: steps,
          })
        );

        const statistics: Statistics = {
          totalSteps: totalSteps,
          averagePerMember: Math.round(totalSteps / uniqueUsersCount),
          averagePerDay: Math.round(totalSteps / uniqueDatesCount),
          averagePerDayAndMember: Math.round(
            totalSteps / (uniqueDatesCount * uniqueUsersCount)
          ),
          cumilativeSteps: cumulativeStepsArray,
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
