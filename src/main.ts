import { AppModule } from './modules/app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/internals/enhancers/filters/all-exceptions.filter';
import { devToolsBasicAuthMiddleware } from './common/config/middlewares/dev-tools-basic-auth.middleware';
import { configSwagger } from './common/config/config-swagger';
import { configBullBoard } from './common/config/config-bull-board';
import { QueueModule } from './modules/setup/queue/queue.module';
import { configCors } from './common/config/config-cors';

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
    const toolsRoutes = {
      swagger: `/swagger`,
      bullBoard: `/bull-board`,
      graphqlPlayground: `${applicationRoutesPrefix}/graphql`,
    } as const;

    // Apply basic auth middleware for the web tools(must be set before the tools)
    Object.keys(toolsRoutes).forEach((routeName) => {
      const route = toolsRoutes[routeName as keyof typeof toolsRoutes];
      app.use(route, devToolsBasicAuthMiddleware);
      Logger.log(`Protected tool ${routeName} route: ${route}`);
    });

    configSwagger(app, toolsRoutes.swagger);

    const queueNames = QueueModule.registeredQueuesConfig.map(
      (queueConfig) => queueConfig.name,
    );
    configBullBoard(app, toolsRoutes.bullBoard, queueNames);
  }

  Logger.log(`Application port: ${process.env.PORT}`);
  await app.listen(process.env.PORT);
}
bootstrap();
