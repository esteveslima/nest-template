// Setup custom logger module
// Not using http request autologging because it cant access request/response data, using the crated interceptor instead
// This logger has a request id session context, allowing to link multiple separated requests

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';
import * as uuid from 'uuid'; // TODO: find a way to use custom provider or service instead of directly on module

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        // Disabling some native features to make use of the custom interceptor

        // Configs for pino
        depthLimit: 3,
        edgeLimit: 50,
        timestamp: true,
        messageKey: 'log',
        formatters: {
          level: (label, number) => ({ level: label }),
          bindings: (bindings) => ({ bindings: undefined }),
          log: (object) => object,
        },

        // Configs for pino http
        genReqId: (req) => uuid.v1(), // Generate uuid for the request session logs

        autoLogging: false,
        quietReqLogger: true,
        customSuccessMessage: (res) => undefined,
        customErrorMessage: (res) => undefined,
        customLogLevel: function (res, err) {
          if (res.statusCode >= 400 || err) return 'error';
          if (res.statusCode >= 300 && res.statusCode < 400) return 'warn';
          return 'info';
        },
      },
    }),
  ],
  exports: [LoggerModule],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggerErrorInterceptor, // used to track error stack, in case of using only native pino http logger
    // },
  ],
})
export class LogModule {}
