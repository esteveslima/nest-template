// Responsible for routing requests

import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginRestRequestDTO } from './dtos/request/auth/auth-login-rest-request.dto';
import { AuthLoginRestResponseDTO } from './dtos/response/auth/auth-login-rest-response.dto';
import { Exception } from 'src/domain/entities/exception';
import { ExceptionsIndex } from 'src/adapters/exceptions/exceptions-index';
import { AuthRestService } from 'src/application/services/auth/auth-rest.service';
import { SwaggerDoc } from 'src/infrastructure/internals/decorators/swagger-doc.decorator';

@Controller('/rest/auth')
export class AuthControllerEntrypoint {
  // Get services and modules from DI
  constructor(private authRestService: AuthRestService) {}

  // Define and map routes to services

  @Post('/login')
  @SwaggerDoc({ tag: '/auth', description: '' })
  async authLogin(
    @Body() params: AuthLoginRestRequestDTO,
  ): Promise<AuthLoginRestResponseDTO> {
    try {
      return await this.authRestService.authLogin(params);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
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
