import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";

const chartConfig = {
  steps: {
    label: "Steps",
    color: "#39679d",
  },
} satisfies ChartConfig;

export const UserStepsChart = ({
  stepsData,
}: {
  stepsData?: {
    id: number;
    date: string;
    steps: number;
  }[];
}) => {
  const data = React.useMemo(() => {
    return stepsData
      ?.map((d) => {
        return {
          ...d,
          date: new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        };
      })
      .reverse();
  }, [stepsData]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <Bar dataKey="steps" fill="var(--color-steps)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
