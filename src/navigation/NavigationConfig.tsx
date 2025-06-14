import { LeaderboardPage } from "@/pages/LeaderboardPage.";
import { MyProgressPage } from "@/pages/MyProgressPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { RegisterStepsPage } from "@/pages/RegisterStepsPage";
import { StatisticsPage } from "@/pages/StatisticsPage";
import { TeamPage } from "@/pages/TeamPage";

interface SitePage {
  name: string;
  path: string;
  component: React.JSX.Element;
}

export const SitePages: SitePage[] = [
  { name: "Home", path: "/", component: <RegisterStepsPage /> },
  { name: "My Progress", path: "/user", component: <MyProgressPage /> },
  { name: "Team", path: "/team", component: <TeamPage /> },
  {
    name: "Leaderboards",
    path: "/leaderboard",
    component: <LeaderboardPage />,
  },
  { name: "Profile", path: "/profile", component: <ProfilePage /> },
  { name: "Statistics", path: "/stats", component: <StatisticsPage /> },
];
