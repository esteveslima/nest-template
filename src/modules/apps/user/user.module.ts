import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MediaModule } from '../media/media.module';
import { UserResolver } from './adapters/entrypoints/resolvers/user.resolver';
import { UserController } from './adapters/entrypoints/controllers/user.controller';
import { UserGraphqlService } from './application/user-graphql.service';
import { HashClientGateway } from './adapters/gateways/clients/hash-client.gateway';
import { UserRepositoryGateway } from './adapters/gateways/databases/repositories/user-repository.gateway';
import { SINGLE_DB } from 'src/modules/setup/db/constants';
import { BcryptCustomProvider } from 'src/common/internals/providers/packages/bcrypt.provider';
import { UserRestService } from './application/user-rest.service';
import { UserInternalService } from './application/user-internal.service';
import { IHashGateway } from './application/ports/hash/hash-gateway.interface';
import { UserDatabaseEntity } from './adapters/gateways/databases/entities/user.entity';
import { IUserGateway } from './domain/repositories/user/user-gateway.interface';

@Module({
  imports: [
    // Auth module
    forwardRef(() => AuthModule), // resolving modules circular dependency(referencing the least deppendant modules)

    // Import ORM Entities Repositories for DI and select connection by name
    TypeOrmModule.forFeature([UserDatabaseEntity], SINGLE_DB),

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
    {
      provide: IUserGateway,
      useClass: UserRepositoryGateway,
    },
    {
      provide: IHashGateway,
      useClass: HashClientGateway,
    },
    UserInternalService,
  ],
  exports: [UserRestService, UserGraphqlService, UserInternalService],
})
export class UserModule {}
