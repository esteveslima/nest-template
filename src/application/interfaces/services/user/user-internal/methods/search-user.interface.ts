import { User } from 'src/domain/entities/user';

export type IUserInternalServiceSearchUserParams = Partial<
  Pick<User, 'username' | 'email'>
>;

export type IUserInternalServiceSearchUserResult = User;
