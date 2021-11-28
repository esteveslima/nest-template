import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

const { NODE_ENV, DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } =
  process.env; // Environment variables expected from the infrastructure process

@Module({
  imports: [
    // Custom config
    ConfigModule.forRoot({
      isGlobal: true, // make the config module available for all modules, dismissing imports/exports
      envFilePath: `.env.${NODE_ENV}`, // load stage specific .env file
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
      synchronize: NODE_ENV !== 'prod',
    }),
    // Feature modules
    MediaModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
