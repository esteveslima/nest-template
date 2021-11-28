import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserPrivateController } from './user.private.controller';
import { UserPublicController } from './user.public.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    // Import ORM Repositories for DI
    TypeOrmModule.forFeature([UserRepository]),
    // Auth module for protected routes
    forwardRef(() => AuthModule), // resolving modules circular dependency(referencing the least deppendant modules)
  ],
  controllers: [UserPublicController, UserPrivateController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
