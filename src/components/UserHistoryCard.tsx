import { useState } from "react";
import { Trash2, BarChart3, Table as TableIcon, Pen, Save } from "lucide-react";
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
import { UserStepsChart } from "./charts/UserStepsChart";
import { Input } from "./ui/input";
import { StepService } from "@/services/StepService";
import { toast } from "sonner";

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
  const [editRecordId, setEditRecordId] = useState<number | null>(null);
  const [updatedSteps, setUpdatedSteps] = useState<number | null>(null);

  const handleEnableEditRecord = (id: number) => {
    if (editRecordId === id) {
      setEditRecordId(null); // Disable edit mode
    } else {
      setEditRecordId(id); // Enable edit mode for the selected record
    }
  };

  const handleUpdateRecord = async () => {
    console.log("Updating record with ID:", editRecordId, updatedSteps);
    if (!editRecordId || updatedSteps === null) return;

    const result = await StepService.updateStepRecord(
      editRecordId,
      updatedSteps
    );

    if (result.success) {
      setEditRecordId(null); // Exit edit mode
      setUpdatedSteps(null); // Clear updated steps
      toast.success("Step record updated successfully");
    } else {
      toast.error(result.error || "Failed to update step record");
    }
  };

  return (
    <Card className="w-full" style={{ background: "#ffffffed" }}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          My progress
        </CardTitle>
        <CardDescription className="text-center">
          Track your progress over time. View your step history in a table or
          chart format.
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
                    <TableHead className="w-70">Date</TableHead>
                    <TableHead>Steps</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {steps.map((record) => (
                    <TableRow key={record.date}>
                      <TableCell className="w-70">
                        {format(new Date(record.date), "PPP")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {editRecordId && editRecordId === record.id ? (
                          <Input
                            type="number"
                            name="steps-edit"
                            defaultValue={record.steps}
                            className=" border-gray-400 edit-steps-input w-20 "
                            style={{ marginLeft: "-12px" }}
                            onChange={(e) => {
                              setUpdatedSteps(
                                Number((e.target as HTMLInputElement).value)
                              );
                            }}
                          />
                        ) : (
                          record.steps.toLocaleString()
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editRecordId && editRecordId === record.id ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-950 hover:bg-blue-100"
                            onClick={() => {
                              handleUpdateRecord();
                            }}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              handleEnableEditRecord(record.id);
                            }}
                            className="text-blue-950 hover:bg-blue-100"
                          >
                            <Pen className="h-4 w-4" />
                          </Button>
                        )}

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
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center">
                <UserStepsChart stepsData={steps} />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
