import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigurationModule } from '../configuration/configuration.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportJwtStrategy } from './passport/passport-jwt-strategy';

@Module({
  imports: [
    // Config module
    ConfigurationModule,

    // External modules for auth
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 600,
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PassportJwtStrategy],
})
export class AuthModule {}
