import type { CumulativeSteps } from "@/types/Statistics";
import { CartesianGrid, Line, LineChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const chartConfig = {
  steps: {
    label: "Steps",
    color: "#39679d",
  },
} satisfies ChartConfig;

export const CumulativeStepsChart = ({ data }: { data: CumulativeSteps[] }) => {
  return (
    <Card className="w-full bg-white/95 mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-center">
          Cumulative steps
        </CardTitle>
        <p className="text-muted-foreground text-center mt-2">
          This chart shows the cumulative (running total) steps taken over time,
          providing a visual representation of the overall progress in this
          competition.
        </p>
      </CardHeader>

      <CardContent className="pt-8">
        {/* Your chart component goes here */}
        <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 8,
                right: 8,
                top: 8,
                bottom: 8,
              }}
            >
              <CartesianGrid vertical={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="steps"
                fill="var(--color-steps)"
                stroke="var(--color-steps)"
                radius={3}
                type="linear"
                strokeWidth={2}
                animationDuration={500}
              />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Optional legend or additional info */}
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full m-1"
              style={{ background: "#39679d" }}
            ></div>
            <span>Cumulative steps</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
