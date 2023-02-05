import { Request } from 'express';
import { AuthTokenPayload } from 'src/application/interfaces/types/auth/auth-token-payload.interface';

export interface IRequestResolvedAuth extends Request {
  authData?: AuthTokenPayload; // set by auth guard
}
