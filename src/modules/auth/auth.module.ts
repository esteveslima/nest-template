import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportJwtStrategy } from './passport/passport-jwt-strategy';

@Module({
  imports: [
    // External modules for auth
    PassportModule,
    JwtModule.registerAsync({
      // Importing JWT Module asyncronously with factory, allowing to access ConfigModule
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // jwt secret env variable
        signOptions: {
          expiresIn: 600,
        },
      }),
    }),
    UserModule, // Module with user data
  ],
  controllers: [AuthController],
  providers: [AuthService, PassportJwtStrategy],
})
export class AuthModule {}
