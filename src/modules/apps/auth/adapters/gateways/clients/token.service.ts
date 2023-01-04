// Helper methods decoupled to be used only internally and not exposed to users

import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';

interface ITokenOptions {
  expiresIn: number; // seconds
}

@Injectable()
export class TokenService {
  // Get services and repositories from DI
  constructor(private jwtService: JwtService) {}

  // Define methods containing business logic

  async decodeToken(token: string): Promise<Record<string, any>> {
    let decodedTokenPayload: Record<string, any>;
    try {
      decodedTokenPayload = this.jwtService.verify(token);
    } catch (e: any) {
      Logger.error(e);
      const isJwtExpired = e.name === 'TokenExpiredError';
      if (isJwtExpired) {
        const payload = this.jwtService.decode(token);
        throw new CustomException('TokenExpired', { token, payload });
      }
      const isJwtMalformed =
        e.name === 'JsonWebTokenError' || e.name === 'SyntaxError';
      if (isJwtMalformed) {
        throw new CustomException('TokenMalformed', { token });
      }
      throw e;
    }

    const isJwtPayloadInvalid = typeof decodedTokenPayload !== 'object';
    if (isJwtPayloadInvalid) {
      throw new CustomException('TokenPayloadInvalid', { token });
    }

    return decodedTokenPayload;
  }

  async generateToken(
    tokenPayload: Record<string, any>,
    options?: ITokenOptions,
  ): Promise<string> {
    const token = this.jwtService.sign(tokenPayload, options);

    return token;
  }
}
