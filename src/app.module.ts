import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';

const { STAGE, DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } =
  process.env; // Environment variables received from the infrastructure and process

@Module({
  imports: [
    // Feature modules
    MediaModule,
    // Custom config
    ConfigModule.forRoot({
      envFilePath: `.env.${STAGE}`, // load stage specific .env file
    }),
    // ORM with config provided from the infrastructure via env variables
    TypeOrmModule.forRoot({
      type: 'postgres', //DB_TYPE,
      host: DB_HOST,
      port: Number.parseInt(DB_PORT),
      username: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      autoLoadEntities: true,
      synchronize: STAGE !== 'prod',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
