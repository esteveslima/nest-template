// Responsible for routing requests

import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { SwaggerDoc } from 'src/common/internals/decorators/swagger-doc.decorator';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { LoginAuthReqDTO } from './dtos/rest/req/login-auth-req.dto';
import { AuthRestService } from './services/domain/auth-rest.service';

@Controller('/rest/auth')
export class AuthController {
  // Get services and modules from DI
  constructor(private authService: AuthRestService) {}

  // Define and map routes to services

  @Post('/login')
  @SwaggerDoc({ tag: '/auth', description: '' })
  async loginAuth(
    @Body() loginAuthCredentials: LoginAuthReqDTO,
  ): ReturnType<typeof AuthRestService.prototype.loginAuth> {
    try {
      return await this.authService.loginAuth(loginAuthCredentials);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        AuthUnhauthorized: new UnauthorizedException('Invalid credentials'),
      });
    }
  }
}
