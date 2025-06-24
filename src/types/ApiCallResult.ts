export interface ApiCallResult<T> {
  data?: T; // The data returned from the API call
  error?: string; // Error message if the API call fails
  success: boolean; // Indicates if the API call was successful
}
