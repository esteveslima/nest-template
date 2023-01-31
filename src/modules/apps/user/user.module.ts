import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MediaModule } from '../media/media.module';
import { UserResolver } from './adapters/entrypoints/resolvers/user.resolver';
import { UserController } from './adapters/entrypoints/controllers/user.controller';
import { UserEntity } from './adapters/gateways/databases/entities/user.entity';
import { UserGraphqlService } from './application/user-graphql.service';
import { HashGatewayGateway } from './adapters/gateways/clients/hash-client.gateway';
import { UserRepository } from './adapters/gateways/databases/repositories/user.repository';
import { SINGLE_DB } from 'src/modules/setup/db/constants';
import { BcryptCustomProvider } from 'src/common/internals/providers/packages/bcrypt.provider';
import { UserRestService } from './application/user-rest.service';
import { UserInternalService } from './application/user-internal.service';
import { HashGateway } from './application/interfaces/ports/hash/hash-gateway.interface';

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
    {
      provide: HashGateway,
      useClass: HashGatewayGateway,
    },
    UserInternalService,
  ],
  exports: [UserRestService, UserGraphqlService, UserInternalService],
})
export class UserModule {}
