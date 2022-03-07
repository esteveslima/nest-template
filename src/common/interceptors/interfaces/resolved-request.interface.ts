import { Request } from 'express';
import { IAuthUser } from 'src/modules/auth/interfaces/user/user.interface';

export interface IResolvedRequest extends Request {
  user?: IAuthUser; // set by interceptor
  startTimestamp?: number;
  isRequestLogged?: boolean;
}
