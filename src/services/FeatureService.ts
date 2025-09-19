import supabase from "@/supabase";

export class FeatureService {
  static async isFeatureEnabled(featureCode: string): Promise<boolean> {
    const result = await supabase()
      .from("Feature_Flags")
      .select("enabled")
      .eq("code", featureCode)
      .single();

    return result.data?.enabled ?? false;
  }
}