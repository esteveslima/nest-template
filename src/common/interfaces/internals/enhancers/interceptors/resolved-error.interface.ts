export interface IResolvedError {
  status: number;
  message: string;
  response: object;
  name: string;
  stack?: string;
}
