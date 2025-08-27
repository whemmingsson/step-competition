import type {ServiceQueryResult} from "@/types/ServiceQueryResult.ts";
import supabase from "@/supabase.ts";

export class BadgeService {
    public static async getBadgesForUser(
        userId: string
    ): Promise<ServiceQueryResult<string[]>> {
        //const cacheKey = `badge_service-getBadgesForUser-${userId}`;

        const {data, error} = await supabase()
            .from("Users_Badges")
            .select("Badges(icon_url)")
            .eq("user_id", userId);

        if (error) {
            return {success: false, error: error.message};
        }
        console.log(data);

        // Extract icon URLs from the nested structure
        const iconUrls: string[] = data
            ?.map((item: any) => item.Badges?.icon_url)
            .filter((url: string | undefined) => url !== undefined) || [];

        return {success: true, data: iconUrls};
    }
}