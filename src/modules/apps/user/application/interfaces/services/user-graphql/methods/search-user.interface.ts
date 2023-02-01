import { User } from 'src/modules/apps/user/domain/entities/user';

export type IUserGraphqlServiceSearchUserParams = Partial<
  Pick<User, 'username' | 'email'>
>;

export type IUserGraphqlServiceSearchUserResult = User[];
