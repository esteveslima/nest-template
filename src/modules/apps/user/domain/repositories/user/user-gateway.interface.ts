import { User } from '../../entities/user';
import { IUserGatewayDeleteUserParams } from './methods/delete-user.interface';
import { IUserGatewayGetUserParams } from './methods/get-user.interface';
import { IUserGatewayModifyUserParams } from './methods/modify-user.interface';
import { IUserGatewayRegisterUserParams } from './methods/register-user.interface';
import { IUserGatewaySearchUserParams } from './methods/search-user.interface';

export abstract class IUserGateway {
  registerUser: (params: IUserGatewayRegisterUserParams) => Promise<User>;
  getUser: (params: IUserGatewayGetUserParams) => Promise<User>;
  searchUser: (params: IUserGatewaySearchUserParams) => Promise<User[]>;
  modifyUser: (params: IUserGatewayModifyUserParams) => Promise<void>;
  deleteUser: (params: IUserGatewayDeleteUserParams) => Promise<void>;
}
