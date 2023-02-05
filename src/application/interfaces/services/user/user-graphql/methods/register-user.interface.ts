import { User } from 'src/domain/entities/user';

export type IUserGraphqlServiceRegisterUserParams = Pick<
  User,
  'username' | 'password' | 'email' | 'role' | 'gender' | 'age'
>;

export type IUserGraphqlServiceRegisterUserResult = User;
