import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { Logger as PinoLogger } from 'nestjs-pino';
import { configBullBoard } from './infrastructure/config/config-bull-board';
import { configCors } from './infrastructure/config/config-cors';
import { configSwagger } from './infrastructure/config/config-swagger';
import { devToolsBasicAuthMiddleware } from './infrastructure/config/dev-tools-basic-auth-middleware';
import { AppModule } from './infrastructure/config/modules/app.module';
import { QueueModule } from './infrastructure/config/modules/queue/queue.module';
import { AllExceptionsFilter } from './infrastructure/internals/enhancers/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Config logger
  app.useLogger(app.get<PinoLogger>(PinoLogger));
  app.flushLogs();

  // Config exceptions filter
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  // Extra configs
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Add DTOs serializer transformation/valitations globally
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }), // Add built-in validation pipe to purge incoming request data globally
  );
  const applicationRoutesPrefix = '/api';
  app.setGlobalPrefix(applicationRoutesPrefix, { exclude: ['/'] }); // Add base prefix for routes

  // Setup cors for all subdomains from specific client domain
  const allowedDomains = process.env.ALLOWED_DOMAINS.split(',');
  configCors(app, allowedDomains);
  Logger.log(`Configured CORS domains: ${allowedDomains}`);

  // Setup developer web tools for non production environments
  const isDevelopmentEnvironment =
    process.env.NODE_ENV && !process.env.NODE_ENV.includes('prod');
  if (isDevelopmentEnvironment) {
    const webToolsRoutes = {
      swagger: `/swagger`,
      bullBoard: `/bull-board`,
      graphqlPlayground: `${applicationRoutesPrefix}/graphql`,
    } as const;

    // Apply basic auth middleware for the web tools(must be set before the tools)
    Object.keys(webToolsRoutes).forEach((routeName) => {
      const route = webToolsRoutes[routeName as keyof typeof webToolsRoutes];
      app.use(route, devToolsBasicAuthMiddleware);
      Logger.log(`Protected tool ${routeName} route: ${route}`);
    });

    configSwagger(app, webToolsRoutes.swagger);

    const queueNames = QueueModule.registeredQueuesConfig.map(
      (queueConfig) => queueConfig.name,
    );
    configBullBoard(app, webToolsRoutes.bullBoard, queueNames);
  }

  Logger.log(`Application port: ${process.env.PORT}`);
  await app.listen(process.env.PORT);
}
bootstrap();
