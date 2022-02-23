import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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
  app.setGlobalPrefix('/api/rest', { exclude: ['/'] });


  await app.listen(process.env.PORT);
}
bootstrap();
