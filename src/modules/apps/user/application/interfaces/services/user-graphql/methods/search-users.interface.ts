import { User } from 'src/modules/apps/user/domain/entities/user';

export type IUserGraphqlServiceSearchUsersParams = Partial<
  Pick<User, 'username' | 'email'>
>;

export type IUserGraphqlServiceSearchUsersResult = User[];
