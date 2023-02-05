import { User } from 'src/domain/entities/user';

export interface IUserRestServiceModifyUserParams {
  indexes: Pick<User, 'id'>;
  data: Partial<
    Pick<User, 'username' | 'password' | 'email' | 'gender' | 'age'>
  >;
}

export type IUserRestServiceModifyUserResult = void;
