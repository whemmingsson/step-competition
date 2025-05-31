import { useUser } from "@/context/user/UserContext";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const DisplayNameBadge = () => {
  const { user, isLoading } = useUser();

  // Show badge if user exists, not loading, and no display name set
  const showBadge = user && !isLoading && !user.displayName;

  if (!showBadge) return null;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="outline" className="bg-yellow-500">
          !
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>Please set a display name</p>
      </TooltipContent>
    </Tooltip>
  );
};
