import { Observable, of } from 'rxjs';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import {
  IHttpClientEndpointConfig,
  IHttpClientEndpointsConfig,
} from '../../types/http-client-endpoints-config.interface';

//  //  //  //  //

// Utils for generating mock results

// Create a mock object compatible with a http service result
export const buildHttpServiceMockResult = <T>(
  status: number,
  data: T,
): Observable<AxiosResponse<T, any>> =>
  of({
    status,
    data,
    statusText: '',
    headers: {},
    config: {} as any,
  });

// Create a mock object compatible with a http service error
export const buildHttpServiceMockError = <T>(
  status: number,
  data: T,
): AxiosError<T> => ({
  config: {} as any,
  isAxiosError: true,
  message: '',
  name: '',
  toJSON: () => ({}),
  code: '',
  request: {},
  response: {
    config: {} as any,
    data,
    headers: {},
    status,
    statusText: '',
    request: {},
  },
  stack: '',
});

//  //  //  //  //

// Utils to find the endpoint route in use for mocking

// Generate a regex based on the endpoint route config, to match considering dynamic path params
const regexifyMockHttpEndpointRoute = (endpointRoute: string) => {
  const regexifiedRouteString = `^(${endpointRoute})$` // set boundaries to avoid partial matches
    .replace('/', '\\/') // escape slashes
    .replace(/\/{.*?}/g, '/[^/]+'); // replace path params(between "{}") to match anything

  return new RegExp(regexifiedRouteString);
};

export const findMatchingEndpointRouteConfig = (
  route: string,
  endpointsConfig: IHttpClientEndpointsConfig,
): IHttpClientEndpointConfig => {
  const matchingEndpointName = Object.keys(endpointsConfig).find(
    (endpointConfigName) => {
      const endpointConfig = endpointsConfig[endpointConfigName];
      const regexifiedRouteTemplate = regexifyMockHttpEndpointRoute(
        endpointConfig.route,
      );
      const isRouteMatchingEndpoint = regexifiedRouteTemplate.test(route);
      return isRouteMatchingEndpoint;
    },
  );

  return endpointsConfig[matchingEndpointName];
};
