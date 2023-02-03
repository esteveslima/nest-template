import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpClientService } from './http-client.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      headers: {
        Accept: 'application/json',
      },
    }),
  ],
  providers: [HttpClientService],
  exports: [HttpClientService, HttpModule],
})
export class HttpClientModule {}
