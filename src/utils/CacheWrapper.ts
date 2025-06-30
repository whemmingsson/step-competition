import CacheService from "@/services/CacheService";
import type { ExecutorResult } from "@/types/apiExecutorTypes";
import type { ServiceQueryResult } from "@/types/ServiceQueryResult";

export const wrapWithCache = async <TReturnType, ExecutorReturnType>(
  cacheKey: string,
  cacheTtlMinutes: number,
  action: () =>
    | Promise<ExecutorResult<ExecutorReturnType>>
    | Promise<ServiceQueryResult<ExecutorReturnType>>
): Promise<TReturnType> => {
  // Check if the result is already cached
  const cachedResult = CacheService.get(cacheKey);
  if (cachedResult) {
    return cachedResult as TReturnType;
  }

  const result = await action();

  if (result.error) {
    console.error("Error executing action:", result.error);
    const errorMessage =
      typeof result.error === "string"
        ? result.error
        : result.error.message || "An unknown error occurred";
    throw new Error(errorMessage);
  }

  const data = result.data as unknown as TReturnType;

  if (data === undefined || data === null) {
    console.error("No data returned from action or type mismatch", data);
    throw new Error("No data returned from action, or type mismatch");
  }

  CacheService.set(cacheKey, data, cacheTtlMinutes);

  return data;
};

export const wrapWithCacheSimple = async <TReturnType>(
  cacheKey: string,
  cacheTtlMinutes: number,
  action: () => Promise<TReturnType>
) => {
  const cachedResult = CacheService.get(cacheKey);
  if (cachedResult) {
    return cachedResult as TReturnType;
  }

  const result = await action();
  CacheService.set(cacheKey, result, cacheTtlMinutes);
  return result;
};
