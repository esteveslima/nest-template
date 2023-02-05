import { User } from 'src/domain/entities/user';

export type IUserInternalServiceVerifyUserPasswordParams = Partial<
  Pick<User, 'username' | 'password'>
>;

export type IUserInternalServiceVerifyUserPasswordResult = boolean;
