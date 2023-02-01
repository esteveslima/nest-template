import { User } from 'src/modules/apps/user/domain/entities/user';

export type IUserRestServiceSearchUserParams = Partial<
  Pick<User, 'username' | 'email'>
>;

type IUserRestServiceSearchUserResultItem = Pick<
  User,
  'id' | 'medias' | 'username' | 'email' | 'role'
>;

export type IUserRestServiceSearchUserResult =
  IUserRestServiceSearchUserResultItem[];
