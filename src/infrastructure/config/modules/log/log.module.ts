import {
  DynamicModule,
  Logger,
  Module,
  OnApplicationBootstrap,
  Provider,
} from '@nestjs/common';
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';
import { LogHttpRequestInterceptor } from './internals/enhancers/interceptors/log-http-request.interceptor';
import { logClientMethods } from './utils/log-client-methods';
import * as crypto from 'crypto';
import * as _ from 'lodash';

interface ILogModuleOptions {
  controllers?: {
    enabled: boolean;
    config?: {
      interceptor: ConstructorParameters<typeof LogHttpRequestInterceptor>[0];
    };
  };
  providers?: {
    context: string;
    providerToken: string;
  }[];

  options?: {
    logger?: Parameters<typeof LoggerModule.forRoot>[0];
  };
}

@Module({})
export class LogModule implements OnApplicationBootstrap {
  static logModuleOptions: ILogModuleOptions = {
    controllers: {
      enabled: true,
      config: {
        interceptor: {
          excludedRoutes: [{ method: 'GET', path: '/' }],
          logger: Logger,
        },
      },
    },
  };

  static setup(configOptions: ILogModuleOptions): DynamicModule {
    LogModule.logModuleOptions = _.merge(
      LogModule.logModuleOptions,
      configOptions,
    );

    const { logModuleOptions } = LogModule;

    const controllerProviders = LogModule.getControllerLogProviders(
      logModuleOptions.controllers,
    );
    const selectedProviders: Provider<any>[] = [...controllerProviders];

    return {
      module: LogModule,
      imports: [
        LoggerModule.forRoot({
          pinoHttp: {
            depthLimit: 3,
            edgeLimit: 50,
            timestamp: true,
            messageKey: 'log',
            formatters: {
              level: (label, number) => ({ level: label }),
              bindings: (bindings) => ({ bindings: undefined }),
              log: (object) => object,
            },

            genReqId: (req) => crypto.randomUUID(),

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
          ...logModuleOptions?.options?.logger, // override default options if logger provided
        }),
      ],
      exports: [LoggerModule],
      providers: [...selectedProviders],
    };
  }

  constructor(private readonly moduleRef: ModuleRef) {}

  // Assign log interceptor for controller logging
  private static getControllerLogProviders(
    controllerOptions: ILogModuleOptions['controllers'],
  ): Provider<any>[] {
    const providers: Provider<any>[] = [];

    const isControllerLogEnabled = !!controllerOptions?.enabled;
    if (isControllerLogEnabled) {
      // // (DISABLED) Pino Logger interceptor
      // providers.push({
      //   provide: APP_INTERCEPTOR,
      //   useClass: LoggerErrorInterceptor,
      // });
      // Custom interceptor
      providers.push({
        provide: APP_INTERCEPTOR,
        useValue: new LogHttpRequestInterceptor(
          controllerOptions?.config?.interceptor,
        ),
      });
    }

    return providers;
  }

  onApplicationBootstrap(): any {
    this.setupProvidersLog(LogModule?.logModuleOptions?.providers);
  }

  // Wrap selected providers with logging
  private setupProvidersLog(
    providersOptionsList: ILogModuleOptions['providers'] = [],
  ) {
    providersOptionsList.forEach((providerOptions) => {
      const { context, providerToken } = providerOptions;
      const provider = this.moduleRef.get(providerToken, {
        strict: false,
      });
      logClientMethods(provider, {
        context,
        logger: Logger,
      });
    });
  }
}
