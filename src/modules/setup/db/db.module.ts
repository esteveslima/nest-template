import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SINGLE_DB } from './constants';
// TODO: databases connections are providers(?)
//TODO: refactor to connect only per feature and not in general, maybe splitting in different databases and connections(?) -> requires changing the project to microservices structure(?)
@Module({
  imports: [
    // ORM with config provided from the infrastructure via env variables
    // Load async to wait for environment variables setup
    TypeOrmModule.forRootAsync({
      name: SINGLE_DB, // name required for selecting this database connection
      useFactory: () => ({
        type: 'postgres', //process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        // logging: true,
        synchronize: process.env.NODE_ENV !== 'prod', //TODO: danger in prod(remove and standardize migrations)
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DBModule {}
