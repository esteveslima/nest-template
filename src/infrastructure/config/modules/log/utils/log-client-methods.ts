/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/ban-types */

// PS.: may not affect factories as the instances are generated at runtime

import { Logger } from '@nestjs/common';
import { ILogPayload } from '../types/log-payload.interface';
import { IMinimalLogger } from '../types/minimal-logger.interface';
import { wrapFunctionWithLogging } from './wrap-function-with-logging';

interface ILogClientMethods<T> {
  context: ILogPayload['context'];
  selectedMethods?: (keyof T)[];
  logger?: IMinimalLogger;
}

export function logClientMethods<T>(client: T, options: ILogClientMethods<T>) {
  const { context } = options;
  const logger = options.logger ?? Logger;
  const selectedMethods = options.selectedMethods ?? [];

  for (const property in client) {
    const isLoggingLimitedToSelectedMethods = selectedMethods.length > 0;
    const isPropertySelectedForLogging =
      !isLoggingLimitedToSelectedMethods ||
      (isLoggingLimitedToSelectedMethods && selectedMethods.includes(property));
    if (!isPropertySelectedForLogging) {
      continue;
    }

    const propertyContent = client[property as keyof T];
    if (typeof propertyContent !== 'function') {
      continue;
    }

    const originalMethod = propertyContent;
    const originalMethodName = property;

    client[property] = wrapFunctionWithLogging(originalMethod, {
      context,
      operation: originalMethodName,
      logger,
    }) as unknown as T[Extract<keyof T, string>];
  }
}
