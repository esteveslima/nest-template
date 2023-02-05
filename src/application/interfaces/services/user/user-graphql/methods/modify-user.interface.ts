import { User } from 'src/domain/entities/user';

export interface IUserGraphqlServiceModifyUserParams {
  indexes: Pick<User, 'id'>;
  data: Partial<
    Pick<User, 'username' | 'password' | 'email' | 'gender' | 'age'>
  >;
}

export type IUserGraphqlServiceModifyUserResult = void;
