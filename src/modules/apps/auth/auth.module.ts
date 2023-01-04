import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { TokenService } from './adapters/gateways/clients/token.service';
import { AuthController } from './adapters/ports/controllers/auth.controller';
import { AuthRestService } from './application/auth-rest.service';
import { AuthResolver } from './adapters/ports/resolvers/auth.resolver';
import { AuthGraphqlService } from './application/auth-graphql.service';

@Module({
  imports: [
    // External modules for auth
    // Load async to wait for environment variables setup
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: 600,
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    // Exposable services
    AuthRestService,
    AuthGraphqlService,
    AuthResolver,

    // Internal services
    TokenService,
  ],
  exports: [AuthRestService, TokenService],
})
export class AuthModule {}
