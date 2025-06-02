import type { User } from "./User";

export interface Team {
  id: number;
  name: string;
  user_id: string; // ID of the user who created the team
  members?: User[]; // Optional array of team members
  totalSteps?: number; // Optional total steps for the team
  avgSteps?: number; // Optional average steps per member
}
