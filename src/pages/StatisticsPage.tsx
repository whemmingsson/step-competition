import { CumulativeStepsChart } from "@/components/charts/CumulativeStepsChart";
import { PageContainer } from "@/components/PageContainer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompetition } from "@/hooks/useComptetition";
import { useStatistics } from "@/hooks/useStatistics";
import { cn } from "@/lib/utils";
import type { Statistics } from "@/types/Statistics";
import { AlertTriangle, BarChart3, TableIcon } from "lucide-react";
import { useState } from "react";

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
        This page contains experimental features and statistical calculations
        that are still under active development. Data presented here may not be
        fully accurate or complete.
      </AlertDescription>
    </Alert>
  );
};

type ViewMode = "metrics" | "chart";

export const StatisticsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("metrics");
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

  const CardList = [
    {
      title: "Total Steps",
      value: select((data) => data.totalSteps),
    },
    {
      title: "Avg steps per member",
      value: select((data) => data.averagePerMember),
    },
    {
      title: "Avg steps per day",
      value: select((data) => data.averagePerDay),
    },
    {
      title: "Avg steps per member & day",
      value: select((data) => data.averagePerDayAndMember),
    },
    {
      title: "Competing teams",
      value: select((data) => data.numberOfTeams),
    },
    {
      title: "Avg steps per team",
      value: select((data) => data.averageStepsPerTeam),
    },
  ];

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
          <div className="flex border-b mb-4">
            <button
              onClick={() => setViewMode("metrics")}
              className={cn(
                "px-4 py-2 font-medium text-sm flex items-center gap-1",
                viewMode === "metrics"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <TableIcon className="h-4 w-4" />
              Key metrics
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={cn(
                "px-4 py-2 font-medium text-sm flex items-center gap-1",
                viewMode === "chart"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Cumulative steps chart
            </button>
          </div>
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg text-center">
              {viewMode === "metrics" && (
                <>
                  <h3 className="text-2xl font-bold mb-2">Key metrics</h3>
                  <div className="grid grid-cols-2 grid-rows-3 gap-4 mt-4">
                    {CardList.map((card, index) => (
                      <NumberCard
                        key={index}
                        title={card.title}
                        value={card.value}
                      />
                    ))}
                  </div>
                </>
              )}
              {viewMode === "chart" && (
                <>
                  <CumulativeStepsChart data={data?.cumilativeSteps || []} />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
