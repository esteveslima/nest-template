import {
  IUserInternalServiceVerifyUserPasswordParams,
  IUserInternalServiceVerifyUserPasswordResult,
} from './methods/verify-user-password.interface';
import {
  IUserInternalServiceSearchUserParams,
  IUserInternalServiceSearchUserResult,
} from './methods/search-user.interface';

export abstract class IUserInternalService {
  searchUser: (
    params: IUserInternalServiceSearchUserParams,
  ) => Promise<IUserInternalServiceSearchUserResult>;
  verifyUserPassword: (
    params: IUserInternalServiceVerifyUserPasswordParams,
  ) => Promise<IUserInternalServiceVerifyUserPasswordResult>;
}
