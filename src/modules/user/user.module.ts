import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DatabaseConfigModule } from '../database-config/database-config.module';
import { MediaModule } from '../media/media.module';
import { UserResolver } from './graphql/user.resolver';
import { HashService } from './hash.service';
import { UserGraphqlService } from './graphql/user-graphql.service';
import { UserInternalService } from './user-internal.service';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    // Auth module
    forwardRef(() => AuthModule), // resolving modules circular dependency(referencing the least deppendant modules)
    // Database module
    DatabaseConfigModule,

    // Import ORM Repositories for DI
    TypeOrmModule.forFeature([UserRepository]),

    // Other feature modules dependencies
    forwardRef(() => MediaModule), // resolving modules circular dependency(referencing the least deppendant modules)
  ],
  controllers: [UserController],
  providers: [
    // Exposable services
    UserService,
    UserGraphqlService,
    UserResolver,

    // Internal services
    HashService,
    UserInternalService,
  ],
  exports: [UserService, UserGraphqlService, UserInternalService],
})
export class UserModule {}
