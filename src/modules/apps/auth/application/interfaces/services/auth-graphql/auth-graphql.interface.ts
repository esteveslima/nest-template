import {
  IAuthGraphqlServiceLoginParams,
  IAuthGraphqlServiceLoginResult,
} from './methods/login.interface';

export abstract class IAuthGraphqlService {
  login: (
    params: IAuthGraphqlServiceLoginParams,
  ) => Promise<IAuthGraphqlServiceLoginResult>;
}
