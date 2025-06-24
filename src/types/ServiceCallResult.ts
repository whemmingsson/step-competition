// This file defines the ServiceCallResult type used for API responses in the application.
export interface ServiceCallResult<T> {
  data?: T; // The data returned from the API call
  error?: string; // Error message if the API call fails
  success: boolean; // Indicates if the API call was successful
}
