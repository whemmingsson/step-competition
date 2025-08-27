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
import { CircleImage } from "@/components/CircleImage.tsx";
import { useLeaderboards } from "@/hooks/useLeaderboards";
import { BadgesList } from "@/components/BadgesList";

export const LeaderboardPage = () => {
  const { userLeaderboard, teamLeaderboard, isLoading, userError, teamError } =
    useLeaderboards(10);

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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          ) : userError ? (
            <div className="text-center text-red-500 py-4">{userError}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Badges</TableHead>
                  <TableHead className="text-right">Total Steps</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userLeaderboard.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {getMedal(index) ? (
                        <span className="text-xl mr-2">{getMedal(index)}</span>
                      ) : (
                        `#${index + 1}`
                      )}
                    </TableCell>
                    <TableCell
                      className={
                        index === 0
                          ? "font-bold text-lg flex items-center gap-x-2"
                          : "flex items-center gap-x-2"
                      }
                    >
                      <CircleImage
                        name={user.displayName}
                        url={user.profileImageUrl}
                      />{" "}
                      {user.displayName}
                    </TableCell>
                    <TableCell>
                      <BadgesList badgeIconUrls={user.badgeIcons} />
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
            Team leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          ) : teamError ? (
            <div className="text-center text-red-500 py-4">{teamError}</div>
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
                {teamLeaderboard.map((team, index) => (
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
                      {team.name}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        index === 0 ? "font-bold text-lg" : ""
                      }`}
                    >
                      {Math.round(team.avgSteps ?? 0).toLocaleString() || "N/A"}
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
