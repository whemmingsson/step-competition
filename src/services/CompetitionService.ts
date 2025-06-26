import supabase from "@/supabase";
import type { Competition } from "@/types/Competition";
import { executeQuery } from "./SupabaseApiService";
import {
  competitionsTransformer,
  competitionTransformer,
} from "@/services/Transformers";
import type { ServiceCallResult } from "@/types/ServiceCallResult";

/**
 * Service for user-related operations
 */
export class CompetitionService {
  /**
   * Fetches the list of competitions from the database
   *
   * @returns Promise with the result of the operation
   */
  static async getCompetitions(): Promise<ServiceCallResult<Competition[]>> {
    return await executeQuery(
      async () => {
        return await supabase()
          .from("Competitions")
          .select("name, id, start_date, end_date")
          .eq("is_private", false);
      },
      competitionsTransformer,
      "competitions_service_get-competitions",
      60
    );
  }

  static async verifyInviteToCompetition(
    inviteId: string,
    inviteKey: string
  ): Promise<boolean> {
    const res = await executeQuery(
      async () => {
        return await supabase()
          .from("Competitions")
          .select("name, id, start_date, end_date")
          .eq("id", parseInt(inviteId))
          .eq("invite_key", inviteKey)
          .single();
      },
      competitionTransformer,
      null,
      null
    );

    if (res.success && res.data) {
      return true;
    }

    return false;
  }
}
