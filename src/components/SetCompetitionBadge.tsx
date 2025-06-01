import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const SetCompetitionBadge = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="secondary" className="bg-black text-white rounded-full">
          ?
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>Please select a competition before start participating.</p>
        <p>This allows for taking part in several different competitions.</p>
        <p>Your selected competition is saved in your browser.</p>
      </TooltipContent>
    </Tooltip>
  );
};
