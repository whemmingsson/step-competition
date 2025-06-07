import { useEffect, useState } from "react";
import { StepService } from "@/services/StepService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageContainer } from "@/components/PageContainer";
import { TeamService } from "@/services/TeamService";
import type { Team } from "@/types/Team";

interface LeaderboardUser {
  displayName: string;
  totalSteps: number;
}

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamError, setTeamError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const result = await StepService.getTopUsers(5);

        if (result.success && result.data) {
          setLeaderboard(result.data as LeaderboardUser[]);
        } else {
          setError(result.error || "Failed to load leaderboard data");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    async function fetchTeamLeaderboard() {
      setLoading(true);
      try {
        const result = await TeamService.getTopTeams(5);

        if (result.success && result.data) {
          setTeamLeaderboard(result.data);
        } else {
          setTeamError("Failed to load team leaderboard data");
        }
      } catch (err) {
        setTeamError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamLeaderboard();
  }, []);

  // Medal emoji based on position
  const getMedal = (position: number) => {
    switch (position) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Card className="w-full" style={{ background: "#ffffffee" }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            User leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Total Steps</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {getMedal(index) ? (
                        <span className="text-xl mr-2">{getMedal(index)}</span>
                      ) : (
                        `#${index + 1}`
                      )}
                    </TableCell>
                    <TableCell
                      className={index === 0 ? "font-bold text-lg" : ""}
                    >
                      {user.displayName}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        index === 0 ? "font-bold text-lg" : ""
                      }`}
                    >
                      {user.totalSteps.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="w-full" style={{ background: "#ffffffee" }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Team Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          ) : teamError ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">
                    Avg steps per member
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamLeaderboard
                  .sort((a, b) => (b?.avgSteps ?? 0) - (a?.avgSteps ?? 0))
                  .map((team, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {getMedal(index) ? (
                          <span className="text-xl mr-2">
                            {getMedal(index)}
                          </span>
                        ) : (
                          `#${index + 1}`
                        )}
                      </TableCell>
                      <TableCell
                        className={index === 0 ? "font-bold text-lg" : ""}
                      >
                        {team.name}
                      </TableCell>
                      <TableCell
                        className={`text-right ${
                          index === 0 ? "font-bold text-lg" : ""
                        }`}
                      >
                        {Math.round(team.avgSteps ?? 0).toLocaleString() ||
                          "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
};
