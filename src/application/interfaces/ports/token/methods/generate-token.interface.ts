interface ITokenOptions {
  expiresIn: number; // seconds
}

export interface ITokenGatewayGenerateTokenParams<T> {
  tokenPayload: T;
  options?: ITokenOptions;
}

export interface ITokenGatewayGenerateTokenResult {
  token: string;
}
