export interface BadgeDTO {
  icon_url?: string | null; // URL to the badge icon image
  type?: string | null; // Type or category of the badge
  description?: string | null; // Description of the badge
  steps?: number | null; // Number of steps required to earn the badge
}
