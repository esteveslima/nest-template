import {
  IUserRestServiceDeleteUserParams,
  IUserRestServiceDeleteUserResult,
} from './methods/delete-user.interface';
import {
  IUserRestServiceGetUserParams,
  IUserRestServiceGetUserResult,
} from './methods/get-user.interface';
import {
  IUserRestServiceModifyUserParams,
  IUserRestServiceModifyUserResult,
} from './methods/modify-user.interface';
import {
  IUserRestServiceRegisterUserParams,
  IUserRestServiceRegisterUserResult,
} from './methods/register-user.interface';
import {
  IUserRestServiceSearchUserParams,
  IUserRestServiceSearchUserResult,
} from './methods/search-user.interface';

export abstract class IUserRestService {
  registerUser: (
    params: IUserRestServiceRegisterUserParams,
  ) => Promise<IUserRestServiceRegisterUserResult>;
  getUser: (
    params: IUserRestServiceGetUserParams,
  ) => Promise<IUserRestServiceGetUserResult>;

  searchUser: (
    params: IUserRestServiceSearchUserParams,
  ) => Promise<IUserRestServiceSearchUserResult>;

  modifyUser: (
    params: IUserRestServiceModifyUserParams,
  ) => Promise<IUserRestServiceModifyUserResult>;
  deleteUser: (
    params: IUserRestServiceDeleteUserParams,
  ) => Promise<IUserRestServiceDeleteUserResult>;
}
