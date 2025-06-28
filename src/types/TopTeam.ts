import type { AppUser } from "./User";

export interface TopTeam {
  id: number;
  userId: string; // ID of the user who created the team
  name: string;
  totalSteps: number;
  numberOfMembers: number;
  avgSteps: number;
  memberIds: string[];
  members?: AppUser[]; // Optional array of team members
}

/* export interface Team {
  id: number;
  name: string;
  user_id: string; // ID of the user who created the team
  members?: AppUser[]; // Optional array of team members
  memberIds?: string[]; // Optional array of member IDs
  numberOfMembers?: number; // Optional count of team members
  totalSteps?: number; // Optional total steps for the team
  avgSteps?: number; // Optional average steps per member
} */
