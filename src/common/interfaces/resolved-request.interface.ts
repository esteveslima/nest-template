import { Request } from 'express';
import { IAuthUserInfo } from 'src/modules/apps/auth/interfaces/payloads/auth-user-info.interface';

export interface IResolvedRequest extends Request {
  user?: IAuthUserInfo; // set by auth guard
}
