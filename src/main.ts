import { AppModule } from './modules/app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/internals/enhancers/filters/all-exceptions.filter';
import { devToolsBasicAuthMiddleware } from './common/internals/enhancers/middlewares/dev-tools-basic-auth.middleware';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Config logger
  app.useLogger(app.get<Logger>(Logger));
  app.flushLogs();

  // Config exceptions filter
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  // Extra configs
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Add DTOs serializer transformation/valitations globally
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }), // Add built-in validation pipe to purge incoming request data globally
  );
  app.setGlobalPrefix('/api', { exclude: ['/'] }); // Add base prefix for routes

  // Setup developer web tools for non production environments
  const isDevelopmentEnvironment =
    process.env.NODE_ENV && !process.env.NODE_ENV.includes('prod');
  if (isDevelopmentEnvironment) {
    const webToolsRoutes = {
      swaggerRoute: '/swagger',
      bullBoardRoute: '/bull-board',
      graphqlPlaygroundRoute: '/api/graphql',
    };

    // Apply basic auth middleware for the web tools(must be set before the tools)
    Object.values(webToolsRoutes).forEach((route) => {
      app.use(route, devToolsBasicAuthMiddleware);
    });

    // Setup swagger
    const swaggerDocumentConfig = new DocumentBuilder()
      .setTitle('media-collection')
      .setVersion('0.0.0')
      .setDescription('Practice template project on Nest.js')
      .addBearerAuth({ type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' })
      .build();
    const swaggerDocument = SwaggerModule.createDocument(
      app,
      swaggerDocumentConfig,
    );
    SwaggerModule.setup(webToolsRoutes.swaggerRoute, app, swaggerDocument, {
      swaggerOptions: { defaultModelsExpandDepth: 0 },
    });

    // // Setup Bull board
    // const serverAdapter = new ExpressAdapter();
    // const queueNames = QueueModule.registeredQueuesConfig.map(
    //   (queueConfig) => queueConfig.name,
    // );
    // createBullBoard({
    //   queues: queueNames.map(
    //     (queueName) =>
    //       new BullAdapter(app.get<Queue>(getQueueToken(queueName))),
    //   ),
    //   serverAdapter,
    // });
    // serverAdapter.setBasePath(webToolsRoutes.bullBoardRoute);
    // app.use(webToolsRoutes.bullBoardRoute, serverAdapter.getRouter());
  }

  // Setup cors for all subdomains from specific client domain
  const allowedDomains = process.env.ALLOWED_DOMAINS.split(',');
  app.enableCors({
    origin: allowedDomains.map(
      (allowedDomain) =>
        new RegExp(
          '^https?:\\/\\/(.*).?[ALLOWED_DOMAIN](:\\d{4})?$'.replace(
            '[ALLOWED_DOMAIN]',
            allowedDomain,
          ),
        ),
    ),
    methods: ['HEAD', 'OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT);
}
bootstrap();
