import { AppModule } from './modules/app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/internals/enhancers/filters/all-exceptions.filter';
import { devToolsBasicAuthMiddleware } from './common/internals/enhancers/middlewares/dev-tools-basic-auth.middleware';
import { LogInterceptor } from './common/internals/enhancers/interceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Config default logger and requests logging
  app.useLogger(app.get(Logger));
  app.flushLogs();
  app.useGlobalInterceptors(new LogInterceptor());

  // Generic filter for unhandled exceptions
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  // Add DTOs serializer transformation/valitations globally
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Add built-in validation pipe to purge incoming request data globally
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Add base prefix for routes
  app.setGlobalPrefix('/api', { exclude: ['/'] });

  // Setup developer web tools for non development environments
  const isDevelopmentEnvironment =
    process.env.NODE_ENV && !process.env.NODE_ENV.includes('prod');
  if (isDevelopmentEnvironment) {
    const webToolsRoutes = {
      swaggerRoute: '/swagger',
      graphqlPlaygroundRoute: '/api/graphql',
    };

    // Apply basic auth middleware for the web tools(must be set before the tools)
    Object.values(webToolsRoutes).forEach((route) => {
      app.use(route, devToolsBasicAuthMiddleware);
    });

    // Setup swagger
    const swaggerDocumentConfig = new DocumentBuilder()
      .setTitle('media-collection')
      .setVersion('1.0')
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
  }

  // Setup cors for all subdomains from specific client domain
  const allowedDomain = 'localhost';
  app.enableCors({
    origin: [
      new RegExp(
        '^https?:\\/\\/(.*).?[ALLOWED_DOMAIN](:\\d{4})?$'.replace(
          '[ALLOWED_DOMAIN]',
          allowedDomain,
        ),
      ),
    ],
    methods: ['HEAD', 'OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT);
}
bootstrap();
