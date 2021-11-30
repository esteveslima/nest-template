// Responsible for routing requests

import { Body, Controller, Post } from '@nestjs/common';
import { Log } from 'src/decorators/log.decorator';
import { AuthService } from './auth.service';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { IResultServiceLoginAuth } from './interfaces/service/auth/login-auth.interface';

@Controller('/auth')
@Log('AuthController')
export class AuthController {
  // Get services and modules from DI
  constructor(private authService: AuthService) {}

  // Define and map routes to services

  @Post('/login')
  async loginAuth(
    @Body() loginAuthCredentials: LoginAuthDTO,
  ): Promise<IResultServiceLoginAuth> {
    return this.authService.loginAuth(loginAuthCredentials);
  }
}
