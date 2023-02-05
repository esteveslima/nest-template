import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Request,
} from '@nestjs/common';

@Controller('/')
export class AppControllerEntrypoint {
  @Get()
  @HttpCode(HttpStatus.OK)
  healthCheck(@Req() request: Request) {
    return;
  }
}
