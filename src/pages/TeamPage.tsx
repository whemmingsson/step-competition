import { useEffect, useState } from "react";
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

// Mock interfaces - in a real app, these would be in a separate types file
interface Team {
  id: string;
  name: string;
  totalSteps: number;
  memberCount: number;
}

export const TeamPage = () => {
  const userContext = useUser();
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);

      const result = await TeamService.getTeams();

      if (result.success && result.data) {
        const teams = result.data.map((team) => ({
          id: team.id,
          name: team.name,
          totalSteps: 0, // Placeholder, replace with actual logic
          memberCount: 1, // Placeholder, replace with actual logic
        }));
        setAvailableTeams(teams);
      } else {
        console.error("Failed to load teams:", result.error);
      }
      setLoading(false);
    };

    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    if (!userContext.user || !userContext.user.id) return;

    setLoading(true);
    try {
      const result = await TeamService.createTeam(
        userContext.user.id,
        newTeamName
      );

      if (result.success && result.data) {
        const newTeam = {
          id: result.data.id,
          name: result.data.name,
          totalSteps: 0, // Placeholder, replace with actual logic
          memberCount: 1, // Placeholder, replace with actual logic
        };
        //setUserTeam(newTeam);
        setAvailableTeams((prev) => [...prev, newTeam]);
        setNewTeamName("");
      } else {
        console.error("Failed to create team:", result.error);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error creating team:", error);
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!selectedTeamId) return;

    setLoading(true);
    try {
      // Mock API call
      console.log(`Joining team with ID: ${selectedTeamId}`);

      // Find the selected team from available teams
      const teamToJoin = availableTeams.find(
        (team) => team.id === selectedTeamId
      );

      // Simulate successful team join
      setTimeout(() => {
        if (teamToJoin) {
          setUserTeam({
            ...teamToJoin,
            memberCount: teamToJoin.memberCount + 1,
          });
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error joining team:", error);
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    setLoading(true);
    try {
      // Mock API call
      console.log("Leaving current team");

      // Simulate successful team leave
      setTimeout(() => {
        setUserTeam(null);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error leaving team:", error);
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Card className="w-full max-w-2xl mx-auto shadow-md">
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
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userTeam ? (
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-2">{userTeam.name}</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-background rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Total Steps</p>
                    <p className="text-2xl font-bold">
                      {userTeam.totalSteps.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-background rounded-md p-4">
                    <p className="text-sm text-muted-foreground">
                      Team Members
                    </p>
                    <p className="text-2xl font-bold">{userTeam.memberCount}</p>
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={handleLeaveTeam}
                className="w-full"
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
                      {availableTeams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name} ({team.memberCount} members)
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
