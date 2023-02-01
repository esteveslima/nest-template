import {
  IUserGraphqlServiceDeleteUserParams,
  IUserGraphqlServiceDeleteUserResult,
} from './methods/delete-user.interface';
import {
  IUserGraphqlServiceGetUserParams,
  IUserGraphqlServiceGetUserResult,
} from './methods/get-user.interface';
import {
  IUserGraphqlServiceModifyUserParams,
  IUserGraphqlServiceModifyUserResult,
} from './methods/modify-user.interface';
import {
  IUserGraphqlServiceRegisterUserParams,
  IUserGraphqlServiceRegisterUserResult,
} from './methods/register-user.interface';
import {
  IUserGraphqlServiceSearchUserParams,
  IUserGraphqlServiceSearchUserResult,
} from './methods/search-user.interface';

export abstract class IUserGraphqlService {
  registerUser: (
    params: IUserGraphqlServiceRegisterUserParams,
  ) => Promise<IUserGraphqlServiceRegisterUserResult>;
  getUser: (
    params: IUserGraphqlServiceGetUserParams,
  ) => Promise<IUserGraphqlServiceGetUserResult>;

  searchUser: (
    params: IUserGraphqlServiceSearchUserParams,
  ) => Promise<IUserGraphqlServiceSearchUserResult>;

  modifyUser: (
    params: IUserGraphqlServiceModifyUserParams,
  ) => Promise<IUserGraphqlServiceModifyUserResult>;
  deleteUser: (
    params: IUserGraphqlServiceDeleteUserParams,
  ) => Promise<IUserGraphqlServiceDeleteUserResult>;
}
