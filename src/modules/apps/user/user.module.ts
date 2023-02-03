import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MediaModule } from '../media/media.module';
import { UserResolverEntrypoint } from './adapters/entrypoints/resolvers/user-resolver.entrypoint';
import { UserControllerEntrypoint } from './adapters/entrypoints/controllers/user-controller.entrypoint';
import { UserGraphqlService } from './application/user-graphql.service';
import { HashBcryptClientGateway } from './adapters/gateways/clients/hash-bcrypt-client.gateway';
import { UserDatabaseRepositoryGateway } from './adapters/gateways/databases/repositories/user-repository.gateway';
import { BcryptCustomProvider } from 'src/common/internals/providers/packages/bcrypt.provider';
import { UserRestService } from './application/user-rest.service';
import { UserInternalService } from './application/user-internal.service';
import { IHashGateway } from './application/interfaces/ports/hash/hash-gateway.interface';
import { UserDatabaseModel } from './adapters/gateways/databases/models/user.model';
import { IUserGateway } from './domain/repositories/user/user-gateway.interface';
import { DBModule } from 'src/modules/setup/db/db.module';

@Module({
  imports: [
    // Auth module
    forwardRef(() => AuthModule), // resolving modules circular dependency(referencing the least deppendant modules)

    // Import ORM Entities Repositories for DI and select connection by name
    DBModule.setup([UserDatabaseModel]),

    // Other feature modules dependencies
    forwardRef(() => MediaModule), // resolving modules circular dependency(referencing the least deppendant modules)
  ],
  controllers: [UserControllerEntrypoint],
  providers: [
    // Custom providers
    BcryptCustomProvider,

    // Exposable services
    UserRestService,
    UserGraphqlService,
    UserInternalService,

    // Non-controllers entry-points
    UserResolverEntrypoint,

    // Internal services
    // manually ensuring clean architecture dependency rule
    {
      provide: IUserGateway,
      useClass: UserDatabaseRepositoryGateway,
    },
    {
      provide: IHashGateway,
      useClass: HashBcryptClientGateway,
    },
  ],
  exports: [UserRestService, UserGraphqlService, UserInternalService],
})
export class UserModule {}
