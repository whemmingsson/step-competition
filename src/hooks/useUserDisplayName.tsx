import { useUser } from "@/context/user/UserContext";
import { UserService } from "@/services/UserService";
import type { QueryResult } from "@/types/QueryResult";
import { useEffect, useState } from "react";

export const useUserDisplayName = (): QueryResult<string | null> => {
  const [displayName, setDisplayName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();

  // Fetch current display name
  useEffect(() => {
    async function fetchDisplayName() {
      if (!user?.id) return;

      setLoading(true);
      try {
        const result = await UserService.getProfileMeta(user.id);

        if (result.success && result.data?.display_name) {
          setDisplayName(result.data?.display_name);
        }
      } catch (err) {
        console.error("Error loading display name:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDisplayName();
  }, [user]);

  return {
    data: displayName,
    loading: loading,
    set: (value) => setDisplayName(value ?? ""),
  };
};
