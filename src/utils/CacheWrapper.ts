import CacheService from "@/services/CacheService";
import type { ExecutorResult } from "@/services/SupabaseApiService";

export const wrapWithCache = async <T, U>(
  cacheKey: string,
  cacheTtlMinutes: number,
  action: () => Promise<ExecutorResult<U>>
): Promise<T> => {
  // Check if the result is already cached
  const cachedResult = CacheService.get(cacheKey);
  if (cachedResult) {
    return cachedResult as T;
  }

  const result = await action();

  if (result.error) {
    console.error("Error executing action:", result.error);
    throw new Error(result.error.message || "An unknown error occurred");
  }

  const data = result.data as unknown as T;

  if (!data) {
    throw new Error("No data returned from action, or type mismatch");
  }

  CacheService.set(cacheKey, data, cacheTtlMinutes);

  return data;
};
