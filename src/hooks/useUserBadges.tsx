import { useEffect, useState } from "react";
import { BadgeService } from "@/services/BadgeService.ts";
import { getAuthenticatedUser } from "@/utils/AuthUtils.ts";

export const useUserBadges = () => {
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const fetchBadges = async () => {
    const user = await getAuthenticatedUser();

    const result = await BadgeService.getBadgesForUser(user.id);
    console.log("useUserBadges", result);

    if (!result.error && result.data) {
      setUserBadges(result.data || []);
      console.log(result);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  return userBadges;
};
