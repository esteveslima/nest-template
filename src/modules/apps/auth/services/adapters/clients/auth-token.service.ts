// Helper methods decoupled to be used only internally and not exposed to users

import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
      if (e.name === 'TokenExpiredError') {
        throw new Error('token expired');
      }
      if (e.name === 'JsonWebTokenError' || 'SyntaxError') {
        throw new Error('malformed token');
      }
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }

    if (typeof tokenPayload !== 'object') {
      throw new Error('invalid token payload');
    }

    return tokenPayload;
  }

  async generateToken(tokenPayload: Record<string, any>): Promise<string> {
    try {
      const token = this.jwtService.sign(tokenPayload);

      return token;
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }
  }
}
