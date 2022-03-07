// Helper methods decoupled to be used only internally and not exposed to users

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthTokenService {
  // Get services and repositories from DI
  constructor(private jwtService: JwtService) {}

  // Define methods containing business logic

  async verifyToken(token: string): Promise<Record<string, any>> {
    const result: Record<string, any> = this.jwtService.verify(token);
    const tokenPayload = result;

    if (typeof tokenPayload !== 'object')
      throw new UnprocessableEntityException('Token invalido');

    return tokenPayload;
  }

  async generateToken(tokenPayload: Record<string, any>): Promise<string> {
    const token = this.jwtService.sign(tokenPayload);

    return token;
  }
}
