export interface ILogPayload {
  context: string;
  operation: string;
  params: unknown;
  result: unknown;
  details: {
    startTime: number;
    executionTime: number;
    errorStack?: string;
    [extraDetailsKeys: string]: unknown; // extra keys for logs
  };
}
