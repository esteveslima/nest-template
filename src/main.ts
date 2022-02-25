import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { GeneralExceptionFilter } from './common/filters/general-exception.filter';
import { LogInterceptor } from './common/interceptors/log.interceptor';
import { CustomLogger } from './common/utils/custom-logger';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Set default logger to be the customized logger
  app.useLogger(new CustomLogger());

  // Add general purpose exception filter(error logging)
  app.useGlobalFilters(new GeneralExceptionFilter());

  // Add general interceptor for request logging
  app.useGlobalInterceptors(new LogInterceptor());

  // Add DTOs serializer transformation/valitations globally
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Add built-in validation pipe to purge incoming request data globally
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

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

  // Add base prefix for controllers
  app.setGlobalPrefix('/api', { exclude: ['/'] });

  // Setup swagger for non production environments
  const isDevelopmentEnvironment =
    process.env.NODE_ENV && !process.env.NODE_ENV.includes('prod');
  if (isDevelopmentEnvironment) {
    const swaggerConfig = {
      path: '/swagger',
      title: 'media-collection',
      version: '1.0',
      description: 'Practice template project on Nest.js',
    };
    // Setup auth for swagger
    app.use(
      swaggerConfig.path,
      basicAuth({
        challenge: true,
        users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASS },
      }),
    );
    // Build swagger
    const swaggerDocumentConfig = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setVersion(swaggerConfig.version)
      .setDescription(swaggerConfig.description)
      .addBearerAuth({ type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' })
      .build();
    const swaggerDocument = SwaggerModule.createDocument(
      app,
      swaggerDocumentConfig,
    );
    SwaggerModule.setup(swaggerConfig.path, app, swaggerDocument);
  }

  await app.listen(process.env.PORT);
}
bootstrap();
