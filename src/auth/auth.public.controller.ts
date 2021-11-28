// Responsible for routing requests

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { IResultServiceLoginAuth } from './interfaces/services/auth/login-auth.interface';

@Controller('public/auth')
export class AuthPublicController {
  // Get services and modules from DI
  constructor(private authService: AuthService) {}

  // Define and map routes to services

  @Post('login')
  async loginAuth(
    @Body() loginAuthCredentials: LoginAuthDTO,
  ): Promise<IResultServiceLoginAuth> {
    return this.authService.loginAuth(loginAuthCredentials);
  }
}
