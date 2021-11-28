// Responsible for routing requests

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { IResultServiceLoginAuth } from './interfaces/login-auth.interface';

@Controller('auth')
export class AuthController {
  // Get services and modules from DI
  constructor(private authService: AuthService) {}

  @Post('login')
  async loginAuth(
    @Body() loginAuthCredentials: LoginAuthDTO,
  ): Promise<IResultServiceLoginAuth> {
    return this.authService.loginAuth(loginAuthCredentials);
  }
}
