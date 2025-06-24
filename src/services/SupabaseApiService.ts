import type { ApiCallResult } from "@/types/ApiCallResult";
import CacheService from "./CacheService";

export interface ExecutorResult<TDto> {
  data?: TDto | null; // The data returned from the executor function
  error?: { message: string } | null; // Error message if the executor function fails
  status?: number;
}
export type ExecutorFunc<TDto> = () => Promise<ExecutorResult<TDto>>;
export type TransformerFunc<TDto, TViewModel> = (data: TDto) => TViewModel;

export const executeQuery = async <TViewModel, TDto>(
  executorFunc: ExecutorFunc<TDto>,
  transformerFunc: TransformerFunc<TDto, TViewModel> | null,
  cacheKey: string | null,
  cacheDurationMinutes: number = 5,
  cacheClearFunc?: () => void
): Promise<ApiCallResult<TViewModel>> => {
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

      if (cacheKey) {
        // Cache the result for future use
        CacheService.set(cacheKey, data, cacheDurationMinutes);
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
