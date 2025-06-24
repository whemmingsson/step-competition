import type { ServiceCallResult } from "@/types/ServiceCallResult";
import CacheService from "./CacheService";
import type {
  ExecutorFunc,
  ExecutorResult,
  TransformerFunc,
} from "@/types/apiExecutorTypes";

/**
 * Executes a query with optional caching and transformation.
 *
 * @param executorFunc - The function that executes the API call.
 * @param transformerFunc - Optional function to transform the API response data.
 * @param cacheKey - Optional key for caching the result.
 * @param cacheDurationMinutes - Duration in minutes to cache the result (default is 5 minutes).
 * @param cacheClearFunc - Optional function to clear related cache entries.
 * @returns A promise that resolves to a ServiceCallResult containing the transformed data or an error message.
 */
export const executeQuery = async <TViewModel, TDto>(
  executorFunc: ExecutorFunc<TDto>,
  transformerFunc: TransformerFunc<TDto, TViewModel> | null,
  cacheKey?: string | null,
  cacheDurationMinutes?: number | null,
  cacheClearFunc?: () => void
): Promise<ServiceCallResult<TViewModel>> => {
  try {
    if (cacheKey) {
      // Check if the query is already cached
      const cachedData = CacheService.get<TViewModel>(cacheKey);
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
        };
      }
    }

    const result: ExecutorResult<TDto> = await executorFunc();

    if (result.error) {
      console.error("API call error:", result.error);
      return {
        success: false,
        error: result.error.message || "An unknown error occurred",
      };
    }

    if (result.data) {
      // Transform the data using the provided transformer function
      let data: TViewModel;
      if (transformerFunc) {
        data = transformerFunc(result.data);
      } else {
        data = result.data as unknown as TViewModel; // Fallback if no transformer is provided
      }

      if (cacheKey && data) {
        // Cache the result for future use
        CacheService.set(cacheKey, data, cacheDurationMinutes || 5);
      }

      if (cacheClearFunc) {
        // Clear any related cache if a clear function is provided
        cacheClearFunc();
      }

      return {
        success: true,
        data: data,
      };
    }

    return {
      success: false,
      error: "No data returned from API",
    };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      error: (error as Error).message || "An unknown error occurred",
    };
  }
};
