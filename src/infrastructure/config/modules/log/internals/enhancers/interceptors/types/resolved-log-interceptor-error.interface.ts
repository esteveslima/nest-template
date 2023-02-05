export interface IResolvedInterceptorError {
  status: number;
  message: string;
  response: object;
  name: string;
  stack?: string;
}
