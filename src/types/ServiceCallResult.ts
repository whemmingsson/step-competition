// This file defines the ServiceCallResult type used for API responses in the application.
export interface ServiceQueryResult<T> {
  data?: T; // The data returned from the API call
  error?: string; // Error message if the API call fails
  success: boolean; // Indicates if the API call was successful
  code?: string; // Optional code for the error, useful for categorizing errors
  clearCache?: () => void; // Optional function to clear cache related to this call
}
