import { ConsoleLogger, ConsoleLoggerOptions } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  // constructor(context?: string, options?: ConsoleLoggerOptions) {
  //   super(context, { timestamp: true, ...options });
  //   const isCloudEnvironment =
  //     !!process.env.NODE_ENV && process.env.NODE_ENV !== 'local';
  //   if (isCloudEnvironment) process.env.NO_COLOR = 'NO_COLOR'; // setting env var to disable color chracters on logs
  // }

  log(message: any, context?: any, ...rest: any[]): void {
    console.log(message);
  }
  debug(message: any, context?: any, ...rest: any[]): void {
    console.log(message);
  }
  verbose(message: any, context?: any, ...rest: any[]): void {
    console.log(message);
  }
  warn(message: any, context?: any, ...rest: any[]): void {
    console.log(message);
  }
  error(message: any, stack?: any, context?: any, ...rest: any[]): void {
    console.log(message);
  }
}
