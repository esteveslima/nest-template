import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MediaModule } from '../media/media.module';
import { UserResolver } from './user.resolver';
import { UserController } from './user.controller';
import { UserEntity } from './models/user.entity';
import { UserRestService } from './services/domain/user-rest.service';
import { UserGraphqlService } from './services/domain/user-graphql.service';
import { HashService } from './services/adapters/clients/hash.service';
import { UserInternalService } from './services/domain/user-internal.service';
import { UserRepository } from './services/adapters/database/repositories/user.repository';
import { SINGLE_DB } from 'src/modules/setup/db/constants';
import { BcryptCustomProvider } from 'src/common/internals/providers/packages/bcrypt.provider';

@Module({
  imports: [
    // Auth module
    forwardRef(() => AuthModule), // resolving modules circular dependency(referencing the least deppendant modules)

    // Import ORM Entities Repositories for DI and select connection by name
    TypeOrmModule.forFeature([UserEntity], SINGLE_DB),

    // Other feature modules dependencies
    forwardRef(() => MediaModule), // resolving modules circular dependency(referencing the least deppendant modules)
  ],
  controllers: [UserController],
  providers: [
    // Custom providers
    BcryptCustomProvider,

    // Exposable services
    UserRestService,
    UserGraphqlService,
    UserResolver,

    // Internal services
    UserRepository,
    HashService,
    UserInternalService,
  ],
  exports: [UserRestService, UserGraphqlService, UserInternalService],
})
export class UserModule {}
