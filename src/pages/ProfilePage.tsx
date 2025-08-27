import { PageContainer } from "@/components/PageContainer";
import { UserProfileCard } from "@/components/UserProfileCard";
import { useAuth } from "@/context/auth/useAuth";
import { useUser } from "@/context/user/UserContext";
import { useUserDisplayName } from "@/hooks/useUserDisplayName";
import { UserService } from "@/services/UserService";
import { useState } from "react";
import { toast } from "sonner";
import { UserGoalCard } from "@/components/UserGoalCard";

export const ProfilePage = () => {
  const { refreshUser, user } = useUser();
  const { session } = useAuth();
  const userId = session?.user?.id;

  const {
    data: displayName,
    loading: displayNameLoading,
    set,
  } = useUserDisplayName();

  // Display name state
  const [isSaving, setIsSaving] = useState(false);

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
        displayName ? displayName.trim() : ""
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

  const setDisplayNameWrapper = (value: string | null) => {
    if (set) set(value ?? "");
  };

  return (
    <PageContainer>
      <UserProfileCard
        displayName={displayName || ""}
        setDisplayName={setDisplayNameWrapper}
        displayNameLoading={displayNameLoading}
        handleUpdateDisplayName={handleUpdateDisplayName}
        isSaving={isSaving}
        userId={userId}
        profileImageUrl={user?.profileImageUrl || undefined}
      />
      <UserGoalCard />
    </PageContainer>
  );
};
