import type { Competition } from "@/types/Competition";
import type { CompetitionDTO } from "@/types/DTO/CompetitionDTO";
import type { ProfileMetaDTO } from "@/types/DTO/ProfileMetaDTO";
import type { StepsRecordDTO } from "@/types/DTO/StepsRecordDTO";
import type { TeamDTO } from "@/types/DTO/TeamDTO";
import type { ProfileMeta } from "@/types/ProfileMeta";
import type { StepsRecord } from "@/types/StepsRecord";
import type { Team } from "@/types/Team";
import type { User } from "@/types/User";

export const profileMetaTransformer = (data: ProfileMetaDTO): ProfileMeta => {
  return {
    profileName: data.display_name || "",
    profileImageUrl: data.profile_image_url || "",
  };
};

export const teamTransformer = (data: TeamDTO | null): Team => {
  if (!data) {
    return {
      id: 0,
      name: "",
      user_id: "unknown",
      members: [],
      memberIds: [],
      numberOfMembers: 0,
      totalSteps: 0,
      avgSteps: 0,
    };
  }

  const result = {
    id: data.id,
    name: data.name || "",
    user_id: data.user_id || null,
    memberIds: data.Users_Teams.map((member) => member.user_id || ""),
  } as Team;

  result.numberOfMembers = result.memberIds?.length || 0;
  result.members =
    result.memberIds?.map((id) => ({ displayName: "UNSET", id: id } as User)) ||
    [];
  return result;
};

export const teamsTransformer = (data: TeamDTO[]): Team[] => {
  return data
    .map((team) => teamTransformer(team))
    .filter((team) => team !== null) as Team[];
};

export const competitionTransformer = (data: CompetitionDTO): Competition => {
  return {
    id: data.id.toString(),
    name: data.name || "",
    startDate: data.start_date || undefined,
    endDate: data.end_date || undefined,
  };
};

export const competitionsTransformer = (
  data: CompetitionDTO[]
): Competition[] => {
  return data.map((competition) => competitionTransformer(competition));
};

export const stepsRecordTransformer = (data: StepsRecordDTO): StepsRecord => {
  return {
    id: data.id,
    user_id: data.user_id,
    steps: data.steps || 0,
    date: data.date || "",
    created_at: data.created_at || "",
  };
};

export const stepsRecordsTransformer = (
  data: StepsRecordDTO[]
): StepsRecord[] => {
  return data.map((record) => stepsRecordTransformer(record));
};
