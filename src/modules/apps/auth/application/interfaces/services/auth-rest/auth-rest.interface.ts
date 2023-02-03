import {
  IAuthRestServiceLoginParams,
  IAuthRestServiceLoginResult,
} from './methods/login.interface';

export abstract class IAuthRestService {
  login: (
    params: IAuthRestServiceLoginParams,
  ) => Promise<IAuthRestServiceLoginResult>;
}
