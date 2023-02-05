// Helper methods decoupled to be used only internally and not exposed to users

import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenExpiredException } from 'src/application/exceptions/ports/token/token-expired.exception';
import { TokenMalformedException } from 'src/application/exceptions/ports/token/token-malformed.exception';
import { TokenPayloadInvalidException } from 'src/application/exceptions/ports/token/token-payload-invalid.exception';
import { ILogGateway } from 'src/application/interfaces/ports/log/log-gateway.interface';
import {
  ITokenGatewayDecodeTokenParams,
  ITokenGatewayDecodeTokenResult,
} from '../../../application/interfaces/ports/token/methods/decode-token.interface';
import {
  ITokenGatewayGenerateTokenParams,
  ITokenGatewayGenerateTokenResult,
} from '../../../application/interfaces/ports/token/methods/generate-token.interface';
import { ITokenGateway } from '../../../application/interfaces/ports/token/token-gateway.interface';

// concrete implementation of the application token dependency
// ideally this layer should also deppend on interfaces, but currently ignoring the dependency rule on this layer towards a more pragmatic approach

@Injectable()
export class TokenJwtGateway<T extends object = Record<string, unknown>>
  implements ITokenGateway<T>
{
  // Get services and repositories from DI
  constructor(
    private jwtService: JwtService,
    private logGateway: ILogGateway,
  ) {}

  // Define methods containing business logic

  async decodeToken(
    params: ITokenGatewayDecodeTokenParams,
  ): Promise<ITokenGatewayDecodeTokenResult<T>> {
    const { token } = params;

    let decodedTokenPayload: T;
    try {
      decodedTokenPayload = this.jwtService.verify(token);
    } catch (e) {
      const error = e as Error;
      this.logGateway.error(error);

      const isJwtExpired = error.name === 'TokenExpiredError';
      if (isJwtExpired) {
        const payload = this.jwtService.decode(token);
        throw new TokenExpiredException({ token, payload });
      }
      const isJwtMalformed =
        error.name === 'JsonWebTokenError' || error.name === 'SyntaxError';
      if (isJwtMalformed) {
        throw new TokenMalformedException({ token });
      }
      throw e;
    }

    const isJwtPayloadInvalid = typeof decodedTokenPayload !== 'object';
    if (isJwtPayloadInvalid) {
      throw new TokenPayloadInvalidException({
        token,
        payload: decodedTokenPayload,
      });
    }

    return decodedTokenPayload;
  }

  async generateToken(
    params: ITokenGatewayGenerateTokenParams<T>,
  ): Promise<ITokenGatewayGenerateTokenResult> {
    const { tokenPayload, options } = params;

    const token = this.jwtService.sign(tokenPayload, options);

    return { token };
  }
}
