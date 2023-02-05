import { User } from 'src/modules/apps/user/domain/entities/user';

export type IUserInternalServiceSearchUserParams = Partial<
  Pick<User, 'username' | 'email'>
>;

export type IUserInternalServiceSearchUserResult = User;
