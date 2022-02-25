import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DatabaseConfigModule } from '../database-config/database-config.module';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    // Auth module
    forwardRef(() => AuthModule), // resolving modules circular dependency(referencing the least deppendant modules)
    // Database module
    DatabaseConfigModule,

    // Import ORM Repositories for DI
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
