// Responsible for routing requests

import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { SwaggerDoc } from 'src/common/internals/decorators/swagger-doc.decorator';
import { AuthRestService } from '../../../application/auth-rest.service';
import { LoginReqDTO } from './dtos/req/login-req.dto';
import { LoginResDTO } from './dtos/res/login-res.dto';
import { Exception } from 'src/common/exceptions/exception';
import { Exceptions } from 'src/common/exceptions/exceptions';

@Controller('/rest/auth')
export class AuthControllerEntrypoint {
  // Get services and modules from DI
  constructor(private authRestService: AuthRestService) {}

  // Define and map routes to services

  @Post('/login')
  @SwaggerDoc({ tag: '/auth', description: '' })
  async login(@Body() params: LoginReqDTO): Promise<LoginResDTO> {
    try {
      return await this.authRestService.login(params);
    } catch (exception) {
      throw Exception.mapExceptions<Exceptions, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          AuthUnauthorizedException: (e) =>
            new UnauthorizedException('Invalid credentials'),
        },
      });
    }
  }
}
