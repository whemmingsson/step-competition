export interface TeamDTO {
  id: number;
  name: string | null;
  user_id: string | null;
  Users_Teams: {
    user_id: string | null;
  }[];
}
