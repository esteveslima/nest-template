import { User } from 'src/domain/entities/user';

export type IUserRestServiceGetUserParams = Pick<User, 'id'>;

export type IUserRestServiceGetUserResult = Pick<
  User,
  | 'id'
  | 'createdAt'
  | 'medias'
  | 'username'
  | 'email'
  | 'role'
  | 'gender'
  | 'age'
>;
