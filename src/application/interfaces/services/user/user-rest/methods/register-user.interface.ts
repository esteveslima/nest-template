import { User } from 'src/domain/entities/user';

export type IUserRestServiceRegisterUserParams = Pick<
  User,
  'username' | 'password' | 'email' | 'role' | 'gender' | 'age'
>;

export type IUserRestServiceRegisterUserResult = Pick<
  User,
  'id' | 'medias' | 'username' | 'email' | 'role' | 'gender' | 'age'
>;
