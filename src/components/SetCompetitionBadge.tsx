import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const SetCompetitionBadge = () => {
  // Get saved competition from localStorage on component mount
  const savedCompetition =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedCompetition")
      : null;

  if (savedCompetition) return null;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="secondary">?</Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>Please select a competition before start participating.</p>
        <p>This allows for taking part in several different competitions.</p>
        <p>Your selected competition is saved in your browser.</p>
      </TooltipContent>
    </Tooltip>
  );
};
