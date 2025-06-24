export interface ExecutorResult<TDto> {
  data?: TDto | null; // The data returned from the executor function
  error?: { message: string } | null; // Error message if the executor function fails
  status?: number;
}
export type ExecutorFunc<TDto> = () => Promise<ExecutorResult<TDto>>;
export type TransformerFunc<TDto, TViewModel> = (data: TDto) => TViewModel;
