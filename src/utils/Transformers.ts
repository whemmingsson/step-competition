import type { ProfileMetaDTO } from "@/types/DTO/ProfileMetaDTO";
import type { TeamDTO } from "@/types/DTO/TeamDTO";
import type { ProfileMeta } from "@/types/ProfileMeta";
import type { Team } from "@/types/Team";

export const profileMetaTransformer = (data: ProfileMetaDTO): ProfileMeta => {
  return {
    profileName: data.display_name || "",
    profileImageUrl: data.profile_image_url || "",
  };
};

export const teamTransformer = (data: TeamDTO): Team => {
  const result = {
    id: data.id,
    name: data.name || "",
    user_id: data.user_id || null,
    memberIds: data.Users_Teams.map((member) => member.user_id || ""),
  } as Team;

  result.numberOfMembers = result.memberIds?.length || 0;
  return result;
};

export const teamsTransformer = (data: TeamDTO[]): Team[] => {
  return data.map((team) => teamTransformer(team));
};
