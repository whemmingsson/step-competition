import { useState } from "react";
import { PageContainer } from "@/components/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2, UserMinus, Users } from "lucide-react";
import { TeamService } from "@/services/TeamService";
import { useUser } from "@/context/user/UserContext";
import type { Team } from "@/types/Team";
import { useTeams } from "@/hooks/useTeams";
import { useUserTeam } from "@/hooks/useUserTeam";
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

export const TeamPage = () => {
  const userContext = useUser();
  const { data: teams, set: setTeams, refetch: refetchTeams } = useTeams();
  const {
    data: userTeam,
    set: setUserTeam,
    loading: userTeamLoading,
    refetch: refetchUserTeam,
  } = useUserTeam();

  const [newTeamName, setNewTeamName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(
    undefined
  );

  // Add state for deletion confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    if (!userContext.user || !userContext.user.id) return;

    try {
      const result = await TeamService.createTeam(
        userContext.user.id,
        newTeamName
      );

      if (result.success && result.data) {
        const t = result.data as Team;
        if (setTeams) {
          setTeams([...(teams ?? []), t]);
        }
        setNewTeamName("");
        toast.success("Team created successfully!");
        if (refetchTeams) refetchTeams();
      } else {
        console.error("Failed to create team:", result.error);
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleJoinTeam = async () => {
    if (!selectedTeamId) return;

    try {
      // Find the selected team from available teams
      const teamToJoin = teams?.find(
        (team) => team.id.toString() === selectedTeamId
      );

      // Simulate successful team join
      if (teamToJoin && userContext.user && userContext.user.id) {
        await TeamService.joinTeam(userContext.user?.id, teamToJoin.id);
        if (refetchUserTeam) {
          refetchUserTeam();
        }
      }

      if (setUserTeam) {
        setUserTeam(teamToJoin || null);
      }

      if (refetchTeams) {
        refetchTeams();
      }
      toast.success("Successfully joined team!");
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  const handleLeaveTeam = async () => {
    try {
      if (!userContext.user || !userContext.user.id || !userTeam) return;

      const result = await TeamService.leaveTeam(
        userContext.user.id,
        userTeam.id
      );

      if (result.success) {
        if (setUserTeam) {
          setUserTeam(null);
        }
        if (refetchTeams) {
          refetchTeams();
        }
        toast.success("Successfully left team!");
      } else {
        console.error("Failed to leave team:", result.error);
      }
    } catch (error) {
      console.error("Error leaving team:", error);
    }
  };

  const handleDeleteTeam = async () => {
    if (!userContext.user || !userContext.user.id) return;

    try {
      const result = await TeamService.deleteTeam(
        parseInt(selectedTeamId ?? "-1"),
        userContext.user.id
      );

      if (result.success) {
        if (setTeams) {
          setSelectedTeamId(undefined);
          setTeams(
            teams
              ? teams.filter(
                  (team) => team.id !== parseInt(selectedTeamId ?? "-1")
                )
              : []
          );
        }
        if (refetchTeams) refetchTeams();
        toast.success("Team deleted successfully!");
      } else {
        console.error("Failed to delete team:", result.error);
      }
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const totalSteps = userTeam?.totalSteps || 0;
  const avgStepsPerMember =
    userTeam?.members && userTeam.members.length > 0
      ? totalSteps / userTeam.members.length
      : 0;

  return (
    <PageContainer>
      <Card
        className="w-full max-w-2xl mx-auto shadow-md"
        style={{ background: "#ffffffee" }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Team Management
          </CardTitle>
          <CardDescription>
            Create or join a team to compete together
          </CardDescription>
        </CardHeader>

        <CardContent>
          {userTeam && !userTeamLoading ? (
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-2">{userTeam.name}</h3>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-background rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Total Steps</p>
                    <p className="text-2xl font-bold">
                      {totalSteps.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-background rounded-md p-4">
                    <p className="text-sm text-muted-foreground">
                      Avg steps per member
                    </p>
                    <p className="text-2xl font-bold">
                      {avgStepsPerMember.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-background rounded-md p-4">
                    <p className="text-sm text-muted-foreground">
                      Team members
                    </p>
                    <p className="text-2xl font-bold">
                      {userTeam.members?.length ?? 0}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLeaveTeam}
                className="w-full cursor-pointer border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2"
              >
                <UserMinus className="h-4 w-4" />
                Leave Team
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Create a New Team</h3>
                <div className="grid gap-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    placeholder="Enter team name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCreateTeam}
                  disabled={!newTeamName.trim()}
                  className="w-full"
                >
                  Create Team
                </Button>
              </div>

              <div className="relative flex items-center py-5">
                <div className="flex-grow border-t border-muted"></div>
                <span className="flex-shrink mx-4 text-muted-foreground">
                  OR
                </span>
                <div className="flex-grow border-t border-muted"></div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Join Existing Team</h3>
                <div className="grid gap-2">
                  <Label htmlFor="join-team">Select Team</Label>
                  <Select
                    onValueChange={setSelectedTeamId}
                    value={selectedTeamId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team to join" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams?.map((team) => {
                        return (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name} ({team?.numberOfMembers ?? 0} members)
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleJoinTeam}
                  disabled={!selectedTeamId}
                  className="w-full"
                >
                  Join Team
                </Button>

                {selectedTeamId &&
                  teams?.find((t) => t.id === parseInt(selectedTeamId))
                    ?.user_id === userContext.user?.id && (
                    <Button
                      onClick={() => setIsDeleteDialogOpen(true)}
                      variant="outline"
                      className="w-full cursor-pointer border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2"
                    >
                      <Trash2 /> Delete team
                    </Button>
                  )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t px-6 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Teams compete by accumulating steps from all team members
          </p>
        </CardFooter>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your team. Individual member progress
              will not be affected, but the team will be removed from the
              competition.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
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
