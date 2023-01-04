import { Request } from 'express';
import { AuthTokenPayload } from 'src/modules/apps/auth/domain/auth-token-payload';

export interface IResolvedRequest extends Request {
  user?: AuthTokenPayload; // set by auth guard
}
