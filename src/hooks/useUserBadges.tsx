import {useEffect, useState} from "react";
import {BadgeService} from "@/services/BadgeService.ts";
import {getAuthenticatedUser} from "@/utils/AuthUtils.ts";

export const useUserBadges = () => {
    const [userBadges, setUserBadges] = useState<string[]>([]);
    const fetchBadges = async () => {
        const user = await getAuthenticatedUser()

        const result = await BadgeService.getBadgesForUser(user.id)
        if (result.success) {
            setUserBadges(result.data || []);
        }
    }
    useEffect(() => {
        fetchBadges()
    }, []);
    return userBadges;
}