import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const { NODE_ENV, DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } =
  process.env; // Environment variables expected from the infrastructure or process(may be the only cases where these variables can be read outside classes)

@Module({
  imports: [
    // ORM with config provided from the infrastructure via env variables
    TypeOrmModule.forRoot({
      type: 'postgres', //DB_TYPE,
      host: DB_HOST,
      port: Number.parseInt(DB_PORT),
      username: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      autoLoadEntities: true,
      synchronize: NODE_ENV !== 'prod', //danger in prod(remove and standardize migrations)
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
