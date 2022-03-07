import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // ORM with config provided from the infrastructure via env variables
    //TODO: refactor to .forFeature(?), maybe splitting in different databases(?) -> requires changing the project to microservices structure(?)
    TypeOrmModule.forRoot({
      type: 'postgres', //DB_TYPE,
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      // logging: true,
      synchronize: process.env.NODE_ENV !== 'prod', //TODO: danger in prod(remove and standardize migrations)
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseConfigModule {}
