import { Request } from 'express';
import { AuthTokenPayload } from 'src/modules/apps/auth/application/interfaces/types/auth-token-payload.interface';

export interface IRequestResolvedAuth extends Request {
  authData?: AuthTokenPayload; // set by auth guard
}
