import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthTokenService } from './services/utils/auth-token.service';

import { AuthController } from './auth.controller';
import { AuthRestService } from './services/domain/auth-rest.service';
import { AuthResolver } from './auth.resolver';
import { AuthGraphqlService } from './services/domain/auth-graphql.service';

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
    AuthTokenService,
  ],
  exports: [AuthRestService, AuthTokenService],
})
export class AuthModule {}
