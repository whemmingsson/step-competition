import { CircleImage } from "./CircleImage";

interface BadgesListProps {
  badgeIconUrls?: string[];
  showNoBadgesText?: boolean;
  badgeSize?: number;
}

export const BadgesList = ({
  badgeIconUrls,
  showNoBadgesText = false,
  badgeSize = 8,
}: BadgesListProps) => {
  if (showNoBadgesText && (!badgeIconUrls || badgeIconUrls.length === 0)) {
    return <p>No badges yet ;)</p>;
  }
  return (
    <>
      {badgeIconUrls?.map((icon: string) => (
        <CircleImage name="" url={icon} size={badgeSize} />
      ))}
    </>
  );
};
