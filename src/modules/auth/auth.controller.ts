// Responsible for routing requests

import { Body, Controller, Post } from '@nestjs/common';
import { SwaggerDoc } from 'src/common/decorators/swagger-doc.decorator';
import { AuthService } from './auth.service';
import { LoginAuthReqDTO } from './dto/req/login-auth-req.dto';

@Controller('/auth')
export class AuthController {
  // Get services and modules from DI
  constructor(private authService: AuthService) {}

  // Define and map routes to services

  @Post('/login')
  @SwaggerDoc({ tag: '/auth', description: '' })
  async loginAuth(
    @Body() loginAuthCredentials: LoginAuthReqDTO,
  ): ReturnType<typeof AuthService.prototype.loginAuth> {
    return this.authService.loginAuth(loginAuthCredentials);
  }
}
