// Helper methods decoupled to be used only internally and not exposed to users

import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AdapterExceptions } from 'src/common/exceptions/adapter-exceptions';
import { CustomException } from 'src/common/exceptions/custom-exception';
import {
  ITokenGatewayDecodeTokenParams,
  ITokenGatewayDecodeTokenResult,
} from '../../../application/interfaces/ports/token/methods/decode-token.interface';
import {
  ITokenGatewayGenerateTokenParams,
  ITokenGatewayGenerateTokenResult,
} from '../../../application/interfaces/ports/token/methods/generate-token.interface';
import { ITokenGateway } from '../../../application/interfaces/ports/token/token-gateway.interface';

@Injectable()
export class TokenJwtGateway<T extends object = Record<string, unknown>>
  implements ITokenGateway<T>
{
  // Get services and repositories from DI
  constructor(private jwtService: JwtService) {}

  // Define methods containing business logic

  async decodeToken(
    params: ITokenGatewayDecodeTokenParams,
  ): Promise<ITokenGatewayDecodeTokenResult<T>> {
    const { token } = params;

    let decodedTokenPayload: T;
    try {
      decodedTokenPayload = this.jwtService.verify(token);
    } catch (e: any) {
      Logger.error(e);
      const isJwtExpired = e.name === 'TokenExpiredError';
      if (isJwtExpired) {
        const payload = this.jwtService.decode(token);
        throw new CustomException<AdapterExceptions>('TokenExpired', {
          token,
          payload,
        });
      }
      const isJwtMalformed =
        e.name === 'JsonWebTokenError' || e.name === 'SyntaxError';
      if (isJwtMalformed) {
        throw new CustomException<AdapterExceptions>('TokenMalformed', {
          token,
        });
      }
      throw e;
    }

    const isJwtPayloadInvalid = typeof decodedTokenPayload !== 'object';
    if (isJwtPayloadInvalid) {
      throw new CustomException<AdapterExceptions>('TokenPayloadInvalid', {
        token,
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
