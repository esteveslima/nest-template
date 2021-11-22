import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable features globally(could also be defined for each module/controller/method)
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
