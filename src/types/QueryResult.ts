export interface QueryResult<T> {
  loading: boolean;
  data?: T;
  set?: (data: T) => void;
  refetch?: () => void;
}
