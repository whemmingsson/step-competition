import { useState } from "react";
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
import { useUserSteps } from "@/hooks/useUserSteps";
import {useUserBadges} from "@/hooks/useUserBadges.tsx";

export const MyProgressPage = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const {
    steps,
    loading,
    error,
    totalSteps,
    avgStepsPerDay,
    userPositionInLeaderboard,
    refetch,
    setSteps,
  } = useUserSteps(userId, false);
  const badgeIcons = useUserBadges()

  // Add state for deletion confirmation
  const [recordToDelete, setRecordToDelete] = useState<StepsRecord | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
      refetch?.(); // Call refetch if provided to refresh data
    } catch (error) {
      toast.error("Failed to delete record");
      console.error(error);
    } finally {
      // Close dialog and clear state
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  return (
    <PageContainer>
      <UserHistoryCard
        steps={steps}
        totalSteps={totalSteps}
        avgStepsPerDay={avgStepsPerDay}
        userPositionInLeaderboard={userPositionInLeaderboard}
        loading={loading}
        handleDeleteClick={handleDeleteClick}
        error={error}
        refetch={refetch}
        badgeIcons={badgeIcons}
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
