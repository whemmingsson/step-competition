import type { ProfileMetaDTO } from "@/types/DTO/ProfileMetaDTO";
import type { ProfileMeta } from "@/types/ProfileMeta";

export const profileMetaTransformer = (data: ProfileMetaDTO): ProfileMeta => {
  return {
    profileName: data.display_name || "",
    profileImageUrl: data.profile_image_url || "",
  };
};
