import {
  IAuthGraphqlServiceAuthLoginParams,
  IAuthGraphqlServiceAuthLoginResult,
} from './methods/auth-login.interface';

export abstract class IAuthGraphqlService {
  authLogin: (
    params: IAuthGraphqlServiceAuthLoginParams,
  ) => Promise<IAuthGraphqlServiceAuthLoginResult>;
}
