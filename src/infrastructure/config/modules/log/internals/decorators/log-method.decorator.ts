/* eslint-disable @typescript-eslint/ban-types */

import { Logger } from '@nestjs/common';
import { wrapFunctionWithLogging } from '../../utils/wrap-function-with-logging';
import { ILogDecoratorOptions } from './types/log-decorator-options.interface';

// May break the code if used alongside other nest decorators that setup external communication(e.g.: @Controllers, @Processor, etc...)
export const LogMethod =
  (options: ILogDecoratorOptions) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value;

    const { context } = options;
    const operation = options.operation ?? propertyKey;
    const logger = options.logger ?? Logger;

    descriptor.value = wrapFunctionWithLogging(originalMethod, {
      context,
      operation,
      logger,
    });
  };
