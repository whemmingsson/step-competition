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

interface LeaderboardUser {
  displayName: string;
  totalSteps: number;
}

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Step Competition Leaderboard
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
    </PageContainer>
  );
};
