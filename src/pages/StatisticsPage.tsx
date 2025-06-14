import { CumulativeStepsChart } from "@/components/charts/CumulativeStepsChart";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompetition } from "@/hooks/useComptetition";
import { useStatistics } from "@/hooks/useStatistics";
import type { Statistics } from "@/types/Statistics";

const NumberCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-background rounded-md p-4">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export const StatisticsPage = () => {
  const { competition, isLoading: competitionLoading } = useCompetition();
  const { data, isLoading } = useStatistics(
    competition?.id ? Number(competition.id) : 0
  );

  const select = (selector: (data: Statistics) => number) => {
    if (isLoading || !data) return "Loading...";
    try {
      return selector(data).toLocaleString();
    } catch (error) {
      console.error("Error accessing statistics data:", error);
      return "N/A";
    }
  };

  return (
    <PageContainer>
      <Card className="w-full" style={{ background: "#ffffffee" }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Competition statistics for:{" "}
            {competitionLoading ? "Loading..." : competition?.name || "N/A"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-2"></h3>
              <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4">
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
              </div>
              <CumulativeStepsChart data={data?.cumilativeSteps || []} />
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
