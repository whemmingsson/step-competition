import { LeaderboardPage } from "@/pages/LeaderboardPage.";
import { MyProgressPage } from "@/pages/MyProgressPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { RegisterStepsPage } from "@/pages/RegisterStepsPage";
import { StatisticsPage } from "@/pages/StatisticsPage";
import { TeamPage } from "@/pages/TeamPage";
import {
  Footprints,
  LineChart,
  Users,
  Trophy,
  UserCircle,
  BarChart3,
} from "lucide-react";

interface SitePage {
  name: string;
  path: string;
  component: React.JSX.Element;
  icon: React.JSX.Element;
}

export const SitePages: SitePage[] = [
  {
    name: "Home",
    path: "/",
    component: <RegisterStepsPage />,
    icon: <Footprints className="h-5 w-5" />,
  },
  {
    name: "Progress",
    path: "/user",
    component: <MyProgressPage />,
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    name: "Team",
    path: "/team",
    component: <TeamPage />,
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: "Leaderboards",
    path: "/leaderboard",
    component: <LeaderboardPage />,
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    name: "Profile",
    path: "/profile",
    component: <ProfilePage />,
    icon: <UserCircle className="h-5 w-5" />,
  },
  {
    name: "Stats",
    path: "/stats",
    component: <StatisticsPage />,
    icon: <BarChart3 className="h-5 w-5" />,
  },
];
