// token generation only concern the application, so its interface is defined here

import {
  ITokenGatewayDecodeTokenParams,
  ITokenGatewayDecodeTokenResult,
} from './methods/decode-token.interface';
import {
  ITokenGatewayGenerateTokenParams,
  ITokenGatewayGenerateTokenResult,
} from './methods/generate-token.interface';

export abstract class ITokenGateway<
  T extends object = Record<string, unknown>,
> {
  decodeToken: (
    params: ITokenGatewayDecodeTokenParams,
  ) => Promise<ITokenGatewayDecodeTokenResult<T>>;
  generateToken: (
    params: ITokenGatewayGenerateTokenParams<T>,
  ) => Promise<ITokenGatewayGenerateTokenResult>;
}
