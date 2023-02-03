export interface IAxiosInterceptorResponseError {
  config: {
    headers: Record<string, string | number>;
    baseURL: string;
    method: string;
    url: string;
    data: any;
  };
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string | number>;
    data: any;
  };
  isAxiosError: true;
}
