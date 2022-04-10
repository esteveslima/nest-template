// Helper methods decoupled to be used only internally and not exposed to users

import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';

@Injectable()
export class AuthTokenService {
  // Get services and repositories from DI
  constructor(private jwtService: JwtService) {}

  // Define methods containing business logic

  async decodeToken(token: string): Promise<Record<string, any>> {
    let tokenPayload: Record<string, any>;
    try {
      tokenPayload = this.jwtService.verify(token);
    } catch (e: any) {
      Logger.error(e);
      if (e.name === 'TokenExpiredError') {
        throw new CustomException('AuthTokenExpired', token);
      }
      if (e.name === 'JsonWebTokenError' || 'SyntaxError') {
        throw new CustomException('AuthTokenMalformed', token);
      }
      throw e;
    }

    if (typeof tokenPayload !== 'object') {
      throw new CustomException('AuthTokenPayloadInvalid', token);
    }

    return tokenPayload;
  }

  async generateToken(tokenPayload: Record<string, any>): Promise<string> {
    const token = this.jwtService.sign(tokenPayload);

    return token;
  }
}
