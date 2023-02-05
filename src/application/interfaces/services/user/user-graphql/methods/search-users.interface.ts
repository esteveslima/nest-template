import { User } from 'src/domain/entities/user';

export type IUserGraphqlServiceSearchUsersParams = Partial<
  Pick<User, 'username' | 'email'>
>;

export type IUserGraphqlServiceSearchUsersResult = User[];
