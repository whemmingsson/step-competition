import { useUser } from "@/context/user/UserContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { TriangleAlert } from "lucide-react";

export const DisplayNameBadge = () => {
  const { user, isLoading } = useUser();

  // Show badge if user exists, not loading, and no display name set
  const showBadge = user && !isLoading && !user.displayName;

  if (!showBadge) return null;

  return (
    <Tooltip>
      <TooltipTrigger>
        <TriangleAlert
          color="#000"
          fill="oklch(79.5% 0.184 86.047)"
        ></TriangleAlert>
      </TooltipTrigger>
      <TooltipContent>
        <p>Please set a display name</p>
      </TooltipContent>
    </Tooltip>
  );
};
