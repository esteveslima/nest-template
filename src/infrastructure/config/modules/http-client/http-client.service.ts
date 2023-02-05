/* eslint-disable @typescript-eslint/ban-types */

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { IAPIJsonResponse } from './types/api-json-response.interface';
import { firstValueFrom, ObservedValueOf } from 'rxjs';
import { IHttpClientEndpointsConfig } from './types/http-client-endpoints-config.interface';
import { ILogPayload } from '../log/types/log-payload.interface';
import { IMinimalLogger } from '../log/types/minimal-logger.interface';
import * as _ from 'lodash';

export interface IHttpClientRequestOptions {
  retry?: {
    attempts: number;
    delayMs?: number;
  };
  auth?: {
    renewable?: {
      authFn: () => Promise<string>;
      tokenStore?: {
        getterFn: () => Promise<string>;
        setterFn: (value: string) => Promise<void>;
      };
      header: {
        key: 'Authorization' | string;
        valuePrefix: 'Bearer' | string;
      };
      authErrorStatusCodes?: number[];
    };
    //  // Not implemented yet
    // basic?: {
    //   user: string;
    //   pass: string;
    // };
  };
  logger?: IMinimalLogger;
}

type IHttpClientRequestConfig = Parameters<
  typeof HttpService.prototype.request
>[0];
type IHttpClientRequestResult = ObservedValueOf<
  ReturnType<typeof HttpService.prototype.request>
>;
export type IHttpClientError = AxiosError;

//function to help type configs without losing intellisense
export function asHttpClientEndpointsConfig<
  T extends IHttpClientEndpointsConfig,
>(arg: T): T {
  return arg;
}

//  //  //  //  //

@Injectable()
export class HttpClientService {
  private httpClientRequestOptions: IHttpClientRequestOptions = {
    retry: { attempts: 1 },
    logger: Logger,
  };

  constructor(private httpService: HttpService) {}

  async customRequest<T>(
    requestConfig: IHttpClientRequestConfig,
    inputRequestOptions?: IHttpClientRequestOptions,
  ): Promise<IAPIJsonResponse<T>> {
    const hasOptions = !!inputRequestOptions;
    if (hasOptions) {
      this.httpClientRequestOptions = _.merge(
        this.httpClientRequestOptions,
        inputRequestOptions,
      );
    }

    const hasAuth = !!this.httpClientRequestOptions?.auth;
    let finalError: any;

    for (
      let currentAttempt = 0;
      currentAttempt <= this.httpClientRequestOptions.retry?.attempts;
      currentAttempt++
    ) {
      const hasDelay = !!this.httpClientRequestOptions.retry?.delayMs;
      const isDelayedAttempt = hasDelay && currentAttempt > 0;
      if (isDelayedAttempt) {
        this.doDelay(this.httpClientRequestOptions.retry?.delayMs);
      }

      // If has auth, use provided config to modify request
      if (hasAuth) {
        const authToken =
          await this.httpClientRequestOptions.auth?.renewable?.tokenStore?.getterFn();

        const authHeaderKey =
          this.httpClientRequestOptions.auth?.renewable?.header?.key;
        const authHeaderValuePrefix =
          this.httpClientRequestOptions.auth.renewable.header.valuePrefix ?? '';

        requestConfig.headers[authHeaderKey] =
          `${authHeaderValuePrefix} ${authToken}`.trim();
      }

      const startTime = Date.now();

      try {
        const result = await firstValueFrom(
          this.httpService.request(requestConfig),
        );

        this.logCompletedHttpRequest('log', result, startTime);

        const { status, headers, data, config } = result;
        return { status, data };
      } catch (e) {
        finalError = e;
        const error = e as AxiosError;

        const isErrorDefined = !!error && !!error?.response;
        if (!isErrorDefined) {
          this.logCompletedHttpRequest(
            'error',
            { data: error } as any,
            startTime,
          );
          continue;
        }

        const { response } = error;
        this.logCompletedHttpRequest('error', response, startTime);

        // If it is an error related to auth, use the provided config to update auth values
        const isAuthError =
          response.status &&
          this.httpClientRequestOptions?.auth?.renewable?.authErrorStatusCodes?.includes(
            response.status,
          );
        if (isAuthError && hasAuth) {
          const authToken =
            await this.httpClientRequestOptions.auth.renewable.authFn();
          await this.httpClientRequestOptions.auth.renewable.tokenStore.setterFn(
            authToken,
          );
        }
      }
    }

    throw finalError;
  }

  private async doDelay(miliseconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, miliseconds));
  }

  private logCompletedHttpRequest(
    level: 'log' | 'error',
    axiosResponse: IHttpClientRequestResult | AxiosError['response'],
    startTime: number,
  ): void {
    const { status, headers, data, config } = axiosResponse;
    const logPayload: ILogPayload = {
      context: 'httpRequest',
      operation: `${config?.method?.toUpperCase()} ${config?.baseURL}${
        config?.url
      }`,
      params: {
        headers: config?.headers,
        queryParams: config?.params,
        body: config?.data,
      },
      result: { status, headers, data },
      details: {
        startTime,
        executionTime: Date.now() - startTime,
      },
    };
    this.httpClientRequestOptions.logger[level](logPayload);
  }
}
