import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/auth/useAuth";
import { StepService } from "@/services/StepService";

import { PageContainer } from "@/components/PageContainer";
import { UserService } from "@/services/UserService";
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
import { useUser } from "@/context/user/UserContext";
import { UserHistoryCard } from "@/components/UserHistoryCard";
import { UserProfileCard } from "@/components/UserProfileCard";
import { useUserDisplayName } from "@/hooks/useUserDisplayName";

interface StepRecord {
  id: number;
  user_id: string;
  steps: number;
  date: string;
  created_at: string;
}

export default function UserPage() {
  // Add this near your other hooks
  const { refreshUser } = useUser();
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [steps, setSteps] = useState<StepRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    data: displayName,
    loading: displayNameLoading,
    set,
  } = useUserDisplayName();

  // Display name state
  const [isSaving, setIsSaving] = useState(false);

  // Add state for deletion confirmation
  const [recordToDelete, setRecordToDelete] = useState<StepRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchUserSteps() {
      if (!userId) return;

      setLoading(true);
      try {
        const result = await StepService.getUserSteps(userId);

        if (result.success && result.data) {
          setSteps(result.data as StepRecord[]);
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

  // Handle display name update
  const handleUpdateDisplayName = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!userId) {
      toast.error("You must be logged in to update your display name");
      return;
    }

    if (displayName && !displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      const result = await UserService.setDisplayName(
        userId,
        displayName ?? ""
      );

      if (result.success) {
        toast.success("Display name updated successfully!");
        refreshUser(); // Refresh user data to reflect changes
      } else {
        toast.error(`Failed to update display name: ${result.error}`);
      }
    } catch (error) {
      toast.error("An error occurred while updating your display name");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (record: { id: number }) => {
    const fullRecord = steps.find((step) => step.id === record.id) || null;
    setRecordToDelete(fullRecord);
    setIsDeleteDialogOpen(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    try {
      await StepService.deleteStepRecord(recordToDelete.id);
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

  const setDisplayNameWrapper = (value: string | null) => {
    if (set) set(value ? value.trim() : "");
  };

  return (
    <PageContainer>
      <UserProfileCard
        displayName={displayName || ""}
        setDisplayName={setDisplayNameWrapper}
        displayNameLoading={displayNameLoading}
        handleUpdateDisplayName={handleUpdateDisplayName}
        isSaving={isSaving}
      />

      <UserHistoryCard
        steps={steps}
        totalSteps={totalSteps}
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
}
