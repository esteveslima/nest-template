// Responsible for routing requests

import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { SwaggerDoc } from 'src/common/internals/decorators/swagger-doc.decorator';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { AuthRestService } from '../../../application/auth-rest.service';
import { LoginReqDTO } from './dtos/req/login-req.dto';
import { LoginResDTO } from './dtos/res/login-res.dto';

@Controller('/rest/auth')
export class AuthController {
  // Get services and modules from DI
  constructor(private authRestService: AuthRestService) {}

  // Define and map routes to services

  @Post('/login')
  @SwaggerDoc({ tag: '/auth', description: '' })
  async login(@Body() params: LoginReqDTO): Promise<LoginResDTO> {
    try {
      return await this.authRestService.login(params);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        AuthUnhauthorized: (customException) =>
          new UnauthorizedException('Invalid credentials'),
      });
    }
  }
}
