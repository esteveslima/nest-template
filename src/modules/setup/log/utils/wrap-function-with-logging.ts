/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/ban-types */

// BEWARE OF POSSIBLE ERRORS: this may modify the function original behavior by embbeding logging as a wrapper into it

import { Logger } from '@nestjs/common';
import { ILogPayload } from '../types/log-payload.interface';
import { IMinimalLogger } from '../types/minimal-logger.interface';

interface IWrapFunctionWithLoggingOptions {
  context: ILogPayload['context'];
  operation: string;
  logger?: IMinimalLogger;
}

export function wrapFunctionWithLogging(
  originalFunction: Function,
  options: IWrapFunctionWithLoggingOptions,
): Function {
  const { context, operation } = options;
  const logger = options.logger ?? Logger;

  return function (this: Function) {
    const args = arguments;
    const params = [...args];
    const startTime = Date.now();

    try {
      const result = originalFunction.apply(this, args);

      if (result instanceof Promise) {
        return result
          .then((promiseResult) => {
            const executionTime = Date.now() - startTime;
            const logPayload: ILogPayload = {
              context,
              operation,
              params,
              result: promiseResult,
              details: {
                startTime,
                executionTime,
              },
            };
            logger.log(logPayload);

            return promiseResult;
          })
          .catch((e) => {
            const executionTime = Date.now() - startTime;
            const logPayload: ILogPayload = {
              context,
              operation,
              params,
              result: (e as Error).message,
              details: {
                startTime,
                executionTime,
                errorStack: (e as Error).stack,
              },
            };
            logger.error(logPayload);

            throw e;
          });
      }

      const executionTime = Date.now() - startTime;
      const logPayload: ILogPayload = {
        context,
        operation,
        params,
        result,
        details: {
          startTime,
          executionTime,
        },
      };
      logger.log(logPayload);

      return result;
    } catch (e) {
      const executionTime = Date.now() - startTime;
      const logPayload: ILogPayload = {
        context,
        operation,
        params,
        result: (e as Error).message,
        details: {
          startTime,
          executionTime,
          errorStack: (e as Error).stack,
        },
      };
      logger.error(logPayload);

      throw e;
    }
  };
}
