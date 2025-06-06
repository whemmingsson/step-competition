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
import { Loader2, Users } from "lucide-react";
import { TeamService } from "@/services/TeamService";
import { useUser } from "@/context/user/UserContext";
import type { Team } from "@/types/Team";
import { useTeams } from "@/hooks/useTeams";
import { useUserTeam } from "@/hooks/useUserTeam";
import { toast } from "sonner";

export const TeamPage = () => {
  const userContext = useUser();
  const {
    data: teams,
    set: setTeams,
    loading: teamsLoading,
    refetch: refetchTeams,
  } = useTeams();
  const {
    data: userTeam,
    set: setUserTeam,
    loading: userTeamLoading,
  } = useUserTeam();

  const [newTeamName, setNewTeamName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

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
      }

      if (setUserTeam) {
        setUserTeam(teamToJoin || null);
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
        toast.success("Successfully left team!");
      } else {
        console.error("Failed to leave team:", result.error);
      }
    } catch (error) {
      console.error("Error leaving team:", error);
    }
  };

  if (teamsLoading || userTeamLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageContainer>
    );
  }

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
          {userTeam ? (
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
                variant="destructive"
                onClick={handleLeaveTeam}
                className="w-full cursor-pointer"
              >
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
                      {teams?.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.name} ({team?.members?.length ?? 0} members)
                        </SelectItem>
                      ))}
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
    </PageContainer>
  );
};
