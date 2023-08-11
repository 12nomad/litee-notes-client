export interface IResponse<T = void> {
  success: boolean;
  error: string | null;
  data: T | null;
  token?: string;
}
