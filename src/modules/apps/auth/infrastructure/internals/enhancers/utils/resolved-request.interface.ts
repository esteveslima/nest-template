import { Request } from 'express';
import { AuthTokenPayload } from 'src/modules/apps/auth/domain/auth-token-payload';

export interface IRequestResolvedAuth extends Request {
  authData?: AuthTokenPayload; // set by auth guard
}
