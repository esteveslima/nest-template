// Responsible for routing requests

import { Body, Controller, Post } from '@nestjs/common';

import { SwaggerDoc } from 'src/common/internals/decorators/swagger-doc.decorator';
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
    return this.authService.loginAuth(loginAuthCredentials);
  }
}
