export interface IResolvedLogInterceptorError {
  status: number;
  message: string;
  response: object;
  name: string;
  stack?: string;
}
