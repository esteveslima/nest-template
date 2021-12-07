import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { MediaController } from './media.controller';
import { MediaRespository } from './media.repository';
import { MediaService } from './media.service';

@Module({
  imports: [
    // Config module
    ConfigurationModule,
    // Auth module
    forwardRef(() => AuthModule), // resolving modules circular dependency(referencing the least deppendant modules)

    // Import ORM Repositories for DI
    TypeOrmModule.forFeature([MediaRespository]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
