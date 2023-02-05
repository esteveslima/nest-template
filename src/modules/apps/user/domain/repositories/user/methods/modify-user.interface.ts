// Interface for repository method
// May extend Entity and modify or omit certain properties to match the operation

import { User } from '../../../entities/user';

export interface IUserGatewayModifyUserParams {
  indexes: Pick<User, 'id'>;
  data: Partial<
    Pick<User, 'username' | 'password' | 'email' | 'gender' | 'age'>
  >;
}
