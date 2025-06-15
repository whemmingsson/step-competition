import { CumulativeStepsChart } from "@/components/charts/CumulativeStepsChart";
import { PageContainer } from "@/components/PageContainer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompetition } from "@/hooks/useComptetition";
import { useStatistics } from "@/hooks/useStatistics";
import type { Statistics } from "@/types/Statistics";
import { AlertTriangle } from "lucide-react";

const NumberCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-background rounded-md p-4">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export const BetaNotification = () => {
  return (
    <Alert
      variant="default"
      className="mb-2 bg-black text-white border-white/10"
    >
      <AlertTriangle />
      <AlertTitle>Beta Features</AlertTitle>
      <AlertDescription className="text-white">
        This section contains experimental features and statistical calculations
        that are still under active development. Data presented here may not be
        fully accurate or complete.
      </AlertDescription>
    </Alert>
  );
};

export const StatisticsPage = () => {
  const { competition, isLoading: competitionLoading } = useCompetition();
  const { data, isLoading } = useStatistics(
    competition?.id ? Number(competition.id) : 0
  );

  const select = (selector: (data: Statistics) => number | null) => {
    if (isLoading || !data) return "Loading...";
    try {
      const value = selector(data);
      if (value === null || value === undefined) return "N/A";
      return value.toLocaleString();
    } catch (error) {
      console.error("Error accessing statistics data:", error);
      return "N/A";
    }
  };

  return (
    <PageContainer>
      <BetaNotification />
      <Card className="w-full" style={{ background: "#ffffffee" }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Statistics for competition:{" "}
            {competitionLoading ? "Loading..." : competition?.name || "N/A"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-2"></h3>
              <div className="grid grid-cols-2 grid-rows-3 gap-4 mt-4">
                <NumberCard
                  title="Total Steps"
                  value={select((data) => data.totalSteps)}
                />
                <NumberCard
                  title="Avg steps per member"
                  value={select((data) => data.averagePerMember)}
                />
                <NumberCard
                  title="Avg steps per day"
                  value={select((data) => data.averagePerDay)}
                />
                <NumberCard
                  title="Avg steps per member & day"
                  value={select((data) => data.averagePerDayAndMember)}
                />
                <NumberCard
                  title="Competing teams"
                  value={select((data) => data.numberOfTeams)}
                />
                <NumberCard
                  title="Avg steps per team"
                  value={select((data) => data.averageStepsPerTeam)}
                />
              </div>
              <CumulativeStepsChart data={data?.cumilativeSteps || []} />
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
