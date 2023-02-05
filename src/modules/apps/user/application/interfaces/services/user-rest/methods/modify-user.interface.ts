import { User } from 'src/modules/apps/user/domain/entities/user';

export interface IUserRestServiceModifyUserParams {
  indexes: Pick<User, 'id'>;
  data: Partial<
    Pick<User, 'username' | 'password' | 'email' | 'gender' | 'age'>
  >;
}

export type IUserRestServiceModifyUserResult = void;
