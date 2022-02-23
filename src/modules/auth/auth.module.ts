import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '../configuration/configuration.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // Config module
    ConfigurationModule,

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
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
