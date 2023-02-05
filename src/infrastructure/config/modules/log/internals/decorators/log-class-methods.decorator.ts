/* eslint-disable @typescript-eslint/ban-types */

import { Logger } from '@nestjs/common';
import { wrapFunctionWithLogging } from '../../utils/wrap-function-with-logging';
import { ILogDecoratorOptions } from './types/log-decorator-options.interface';

// May break the code if used alongside other nest decorators that setup external communication(e.g.: @Controllers, @Processor, etc...)
export const LogClassMethods =
  (options: ILogDecoratorOptions) =>
  (target: Function): void => {
    const decoratedClass = target.prototype;
    const classAllPropertyNames = Object.getOwnPropertyNames(decoratedClass);
    const classMethodsNames = classAllPropertyNames.filter((propertyName) => {
      if (propertyName === 'constructor') {
        return false;
      }
      const descriptor = Object.getOwnPropertyDescriptor(
        decoratedClass,
        propertyName,
      );
      const isMethod = descriptor.value instanceof Function;
      return isMethod;
    });

    classMethodsNames.forEach((methodName) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        decoratedClass,
        methodName,
      );
      const originalMethod = descriptor.value;

      const { context } = options;
      const operation = options.operation ?? methodName;
      const logger = options.logger ?? Logger;

      descriptor.value = wrapFunctionWithLogging(originalMethod, {
        context,
        operation,
        logger,
      });

      Object.defineProperty(decoratedClass, methodName, descriptor);
    });
  };
