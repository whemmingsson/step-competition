import { Pen, Save, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { StepsRecord } from "@/types/StepsRecord";
import { useState } from "react";
import { toast } from "sonner";
import { StepService } from "@/services/StepService";
import { format } from "date-fns";

export const UserStepsTable = ({
  steps,
  refetch,
  handleDeleteClick,
}: {
  steps: StepsRecord[];
  refetch?: () => Promise<void>;
  handleDeleteClick: (record: StepsRecord) => void;
}) => {
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
    if (!editRecordId || updatedSteps === null) return;

    const result = await StepService.updateStepRecord(
      editRecordId,
      updatedSteps
    );

    if (result.success) {
      setEditRecordId(null); // Exit edit mode
      setUpdatedSteps(null); // Clear updated steps
      toast.success("Step record updated successfully");
      refetch?.(); // Call refetch if provided to refresh data
    } else {
      toast.error(result.error || "Failed to update step record");
    }
  };

  return (
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
        {(steps ?? []).map((record) => (
          <TableRow key={record.id}>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission
                      handleUpdateRecord();
                    }
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
  );
};
