import { User } from 'src/domain/entities/user';

export type IUserRestServiceSearchUsersParams = Partial<
  Pick<User, 'username' | 'email'>
>;

type IUserRestServiceSearchUsersResultItem = Pick<
  User,
  'id' | 'medias' | 'username' | 'email' | 'role'
>;

export type IUserRestServiceSearchUsersResult =
  IUserRestServiceSearchUsersResultItem[];
