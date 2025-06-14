import { useState, useEffect, useMemo } from "react";
import { StepService } from "@/services/StepService";
import type { StepsRecord } from "@/types/StepsRecord";
import React from "react";

/**
 * Hook to fetch user steps data
 * @param userId - The user ID to fetch steps for
 * @param session - Authentication session (or any other dependency that should trigger refetch)
 * @param groupByDate - Whether to group steps by date (default: false)
 * @returns Object containing steps data, loading state, error state and refetch function
 */
export function useUserSteps(
  userId: string | undefined,
  groupByDate: boolean = false
) {
  const [steps, setSteps] = useState<StepsRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserSteps = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await StepService.getUserSteps(userId, groupByDate);

      if (result.success && result.data) {
        setSteps(result.data as StepsRecord[]);
      } else {
        setError(result.error || "Failed to load step data");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate total steps
  const totalSteps = useMemo(
    () => steps.reduce((sum, record) => sum + record.steps, 0),
    [steps]
  );

  // Calculate average steps per day
  const avgStepsPerDay = React.useMemo(
    () => (steps.length > 0 ? Math.round(totalSteps / steps.length) : 0),
    [steps, totalSteps]
  );

  return {
    steps,
    loading,
    error,
    totalSteps,
    avgStepsPerDay,
    refetch: fetchUserSteps,
    setSteps, // Expose setSteps for manual updates if needed
  };
}
