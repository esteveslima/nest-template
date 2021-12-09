// Responsible for routing requests

import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Log } from '../../decorators/log.decorator';
import { SerializeOutput } from '../../decorators/serialize-output.decorator';
import { AuthService } from './auth.service';
import { LoginAuthReqDTO } from './dto/req/login-auth-req.dto';
import { LoginAuthResDTO } from './dto/res/login-auth-res.dto';

@Controller('/auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Pipes for validating request DTO, removing undeclared properties
@Log('AuthController') // Custom log interceptor
export class AuthController {
  // Get services and modules from DI
  constructor(private authService: AuthService) {}

  // Define and map routes to services

  @Post('/login')
  @SerializeOutput(LoginAuthResDTO)
  async loginAuth(
    @Body() loginAuthCredentials: LoginAuthReqDTO,
  ): Promise<LoginAuthResDTO> {
    return this.authService.loginAuth(loginAuthCredentials);
  }
}
