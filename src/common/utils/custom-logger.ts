import { ConsoleLogger, ConsoleLoggerOptions } from '@nestjs/common';

//TODO: create module for custom logger?
export class CustomLogger extends ConsoleLogger {
  constructor(context?: string, options?: ConsoleLoggerOptions) {
    super(context, { ...options });
  }

  log(message: any, context?: any, ...rest: any[]): void {
    console.log(message);
  }
  info(message: any, context?: any, ...rest: any[]): void {
    console.info(message);
  }
  debug(message: any, context?: any, ...rest: any[]): void {
    console.debug(message);
  }
  verbose(message: any, context?: any, ...rest: any[]): void {
    console.log(message);
  }
  warn(message: any, context?: any, ...rest: any[]): void {
    console.warn(message);
  }
  error(message: any, stack?: any, context?: any, ...rest: any[]): void {
    console.error(message);
  }
}
