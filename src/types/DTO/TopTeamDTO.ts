export interface TopTeamDTO {
  id: number;
  user_id: string; // ID of the user who created the team
  name: string;
  total_steps: number;
  member_count: number;
  avg_steps_per_member: number;
  member_ids: string;
}
