import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaRespository } from './media.repository';
import { MediaService } from './media.service';

@Module({
  imports: [
    // Import ORM Repositories for DI
    TypeOrmModule.forFeature([MediaRespository]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
