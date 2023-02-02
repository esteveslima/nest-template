import { User } from 'src/modules/apps/user/domain/entities/user';

export type IUserInternalServiceVerifyUserPasswordParams = Partial<
  Pick<User, 'username' | 'password'>
>;

export type IUserInternalServiceVerifyUserPasswordResult = boolean;
