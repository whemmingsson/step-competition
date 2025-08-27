import supabase from "@/supabase";
import { LocalStorageService } from "./LocalStorageService";
import type { Goal } from "@/types/Goal";
import type { ServiceQueryResult } from "@/types/ServiceQueryResult";
import { executeQuery } from "./SupabaseApiService";
import { goalTransformer } from "./Transformers";

export class GoalsService {
  static async getGoal(userId: string): Promise<ServiceQueryResult<Goal>> {
    return await executeQuery(
      async () => {
        return await supabase()
          .from("Users_Goals")
          .select("*")
          .eq("user_id", userId)
          .eq(
            "competition_id",
            LocalStorageService.getSelectedCompetitionId() ?? -1
          )
          .single();
      },
      goalTransformer,
      null,
      null
    );
  }

  static async hasGoal(userId: string): Promise<boolean> {
    const goal = await this.getGoal(userId);
    return goal !== null && goal.success && goal.data !== null;
  }

  static async setGoal(
    userId: string,
    goalMeters: number | null,
    goalSteps: number | null
  ): Promise<void> {
    if (await this.hasGoal(userId)) {
      // If a goal already exists, update it instead of inserting a new one
      await supabase()
        .from("Users_Goals")
        .update({
          goal_meters: goalMeters ?? undefined,
          goal_steps: goalSteps ?? undefined,
        })
        .eq("user_id", userId)
        .eq(
          "competition_id",
          LocalStorageService.getSelectedCompetitionId() ?? -1
        )
        .select()
        .single();

      return;
    }
    await supabase()
      .from("Users_Goals")
      .insert([
        {
          user_id: userId,
          competition_id: LocalStorageService.getSelectedCompetitionId() ?? -1,
          goal_meters: goalMeters,
          goal_steps: goalSteps,
        },
      ])
      .select()
      .single();
  }
}
