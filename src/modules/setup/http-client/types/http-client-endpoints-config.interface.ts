export interface IHttpClientEndpointConfig {
  method: string;
  route: string;
}

export type IHttpClientEndpointsConfig = Record<
  string,
  IHttpClientEndpointConfig
>;
