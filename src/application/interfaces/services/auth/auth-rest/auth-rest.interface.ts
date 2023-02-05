import {
  IAuthRestServiceAuthLoginParams,
  IAuthRestServiceAuthLoginResult,
} from './methods/auth-login.interface';

export abstract class IAuthRestService {
  authLogin: (
    params: IAuthRestServiceAuthLoginParams,
  ) => Promise<IAuthRestServiceAuthLoginResult>;
}
