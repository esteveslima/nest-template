import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MediaController } from './media.controller';
import { MediaRespository } from './media.repository';
import { MediaService } from './media.service';

@Module({
  imports: [
    // Import ORM Repositories for DI
    TypeOrmModule.forFeature([MediaRespository]),
    // Auth module for protected routes
    forwardRef(() => AuthModule), // resolving modules circular dependency(referencing the least deppendant modules)
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
