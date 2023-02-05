import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TokenJwtGateway } from './adapters/gateways/clients/token-jwt.gateway';
import { AuthControllerEntrypoint } from './adapters/entrypoints/controllers/auth-controller.entrypoint';
import { AuthRestService } from './application/auth-rest.service';
import { AuthResolverEntrypoint } from './adapters/entrypoints/resolvers/auth-resolver.entrypoint';
import { AuthGraphqlService } from './application/auth-graphql.service';
import { ITokenGateway } from './application/interfaces/ports/token/token-gateway.interface';
import { JwtClientModule } from 'src/modules/setup/jwt-client/jwt-client.module';

@Module({
  imports: [
    // External modules for auth
    // Load async to wait for environment variables setup
    JwtClientModule.setup(),

    UserModule,
  ],
  controllers: [AuthControllerEntrypoint],
  providers: [
    // Exposable services
    AuthRestService,
    AuthGraphqlService,

    // Non-controllers entry-points
    AuthResolverEntrypoint,

    // Internal services
    // manually ensuring clean architecture dependency rule
    TokenJwtGateway, // required by nestjs to be used on manual injections in enhancers
    {
      provide: ITokenGateway,
      useClass: TokenJwtGateway,
    },
  ],
  exports: [AuthRestService, TokenJwtGateway],
})
export class AuthModule {}
