import { useState } from "react";
import { Trash2, BarChart3, Table as TableIcon } from "lucide-react";
import { Button } from "./ui/button";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "@/lib/utils";
import type { StepsRecord } from "@/types/StepsRecord";

interface UserHistoryCardProps {
  steps: { id: number; date: string; steps: number }[];
  totalSteps: number;
  avgStepsPerDay?: number; // Optional, can be calculated if needed
  loading: boolean;
  error: string | null;
  handleDeleteClick: (record: StepsRecord) => void;
}

type ViewMode = "table" | "chart";

export const UserHistoryCard = ({
  steps,
  totalSteps,
  avgStepsPerDay = 0, // Default to 0 if not provided
  loading,
  error,
  handleDeleteClick,
}: UserHistoryCardProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  return (
    <Card className="w-full" style={{ background: "#ffffffed" }}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Your Step History
        </CardTitle>
        <CardDescription className="text-center">
          Track your progress over time
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!loading && (
          <div className="grid grid-cols-2 gap-4 mt-2 mb-6 text-center">
            <div className="bg-background rounded-md p-4">
              <p className="text-sm text-muted-foreground">Total steps</p>
              <p className="text-2xl font-bold">
                {totalSteps.toLocaleString()}
              </p>
            </div>
            <div className="bg-background rounded-md p-4">
              <p className="text-sm text-muted-foreground">
                Avg. steps per day
              </p>
              <p className="text-2xl font-bold">{avgStepsPerDay}</p>
            </div>
          </div>
        )}

        <div className="flex border-b mb-4">
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "px-4 py-2 font-medium text-sm flex items-center gap-1",
              viewMode === "table"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TableIcon className="h-4 w-4" />
            Table
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
            Chart
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : steps.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No step data available. Start recording your steps!
          </div>
        ) : (
          <>
            {viewMode === "table" ? (
              <Table>
                <TableCaption>A history of your recorded steps</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Steps</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {steps.map((record) => (
                    <TableRow key={record.date}>
                      <TableCell>
                        {format(new Date(record.date), "PPP")}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {record.steps.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            handleDeleteClick({ ...record } as StepsRecord);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-12 text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/70 mb-2" />
                <h3 className="font-semibold text-lg mb-2">
                  Chart View Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  A visualization of your step history will be implemented here.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
