import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({})
export class JwtClientModule {
  static setup(): DynamicModule {
    return {
      module: JwtClientModule,
      imports: [
        JwtModule.registerAsync({
          useFactory: () => ({
            secret: process.env.JWT_SECRET,
            signOptions: {
              expiresIn: +process.env.JWT_EXPIRES_SECONDS, // default ttl for token
            },
          }),
        }),
      ],
      exports: [JwtModule],
    };
  }
}
