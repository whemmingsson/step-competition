export interface ServiceMutationResult<T = void> {
  success: boolean;
  error?: string;
  data?: T; // The data returned from the API call
}
