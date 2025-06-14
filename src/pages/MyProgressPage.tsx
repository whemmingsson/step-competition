import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/auth/useAuth";
import { StepService } from "@/services/StepService";

import { PageContainer } from "@/components/PageContainer";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserHistoryCard } from "@/components/UserHistoryCard";
import type { StepsRecord } from "@/types/StepsRecord";

export const MyProgressPage = () => {
  // Add this near your other hooks
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [steps, setSteps] = useState<StepsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add state for deletion confirmation
  const [recordToDelete, setRecordToDelete] = useState<StepsRecord | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchUserSteps() {
      if (!userId) return;

      setLoading(true);
      try {
        const result = await StepService.getUserSteps(userId);

        if (result.success && result.data) {
          setSteps(result.data as StepsRecord[]);
        } else {
          setError(result.error || "Failed to load step data");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserSteps();
  }, [userId, session]);

  // Handle delete confirmation
  const handleDeleteClick = (record: StepsRecord) => {
    setRecordToDelete(record);
    setIsDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    try {
      await StepService.deleteStepRecordsOnDate(recordToDelete.date);
      toast.success("Record deleted successfully");

      // Update the UI by removing the deleted record
      setSteps(steps.filter((record) => record.id !== recordToDelete.id));
    } catch (error) {
      toast.error("Failed to delete record");
      console.error(error);
    } finally {
      // Close dialog and clear state
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  // Calculate total steps
  const totalSteps = steps.reduce((sum, record) => sum + record.steps, 0);

  // Calculate avg steps per day
  // Calculate avg steps per day using useMemo
  const avgStepsPerDay = useMemo(() => {
    if (steps.length === 0) return 0;
    const totalDays = new Set(steps.map((s) => s.date)).size;
    const totalSteps = steps.reduce((sum, record) => sum + record.steps, 0);
    return totalDays > 0 ? Math.round(totalSteps / totalDays) : 0;
  }, [steps]);

  return (
    <PageContainer>
      <UserHistoryCard
        steps={steps}
        totalSteps={totalSteps}
        avgStepsPerDay={avgStepsPerDay}
        loading={loading}
        handleDeleteClick={handleDeleteClick}
        error={error}
      />

      {/* Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your step record for{" "}
              {recordToDelete && format(new Date(recordToDelete.date), "PPP")}{" "}
              with {recordToDelete?.steps.toLocaleString()} steps.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRecordToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};
