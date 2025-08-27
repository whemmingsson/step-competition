export interface TopUser {
  displayName: string; // The display name of the top user
  profileImageUrl: string; // URL to the user's profile image
  totalSteps: number; // Total steps taken by the user
  badgeIcons?: string[]; // Optional array of badge icon URLs associated with the user
}
