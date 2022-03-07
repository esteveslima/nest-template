import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthTokenService } from './auth-token.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResolver } from './graphql/auth.resolver';

@Module({
  imports: [
    // External modules for auth
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 600,
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    // Exposable services
    AuthService,
    AuthResolver,

    // Internal services
    AuthTokenService,
  ],
  exports: [AuthService, AuthTokenService],
})
export class AuthModule {}
