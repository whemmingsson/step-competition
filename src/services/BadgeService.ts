import type { ServiceQueryResult } from "@/types/ServiceQueryResult.ts";
import supabase from "@/supabase.ts";
import CacheService from "./CacheService";
import type { Badge } from "@/types/Badge";
import { executeQuery } from "./SupabaseApiService";
import { badgesTransformer } from "./Transformers";

export class BadgeService {
  public static async getBadgesForUser(
    userId: string
  ): Promise<ServiceQueryResult<string[]>> {
    const cacheKey = `badge_service-getBadgesForUser-${userId}`;

    const cached = CacheService.get<string[]>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const { data, error } = await supabase()
      .from("Users_Badges")
      .select("Badges(icon_url)")
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Extract icon URLs from the nested structure
    const iconUrls: string[] =
      data
        ?.map((item: any) => item.Badges?.icon_url)
        .filter((url: string | undefined) => url !== undefined) || [];

    CacheService.set(cacheKey, iconUrls);

    return { success: true, data: iconUrls };
  }

  public static async getAllBadges(): Promise<ServiceQueryResult<Badge[]>> {
    return await executeQuery(
      async () => {
        return await supabase()
          .from("Badges")
          .select("*")
          .order("steps", { ascending: true });
      },
      badgesTransformer,
      `badge_service-getAllBadges`,
      60
    );
  }

  public static async assignBadgeToUser(
    userId: string,
    badgeId: string
  ): Promise<ServiceQueryResult<void>> {
    const { data, error } = await supabase()
      .from("Users_Badges")
      .insert([{ user_id: userId, badge_id: Number(badgeId) }]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  }
}
