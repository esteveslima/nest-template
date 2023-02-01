import { User } from 'src/modules/apps/user/domain/entities/user';

export type IUserGraphqlServiceGetUserParams = Pick<User, 'id'>;

export type IUserGraphqlServiceGetUserResult = User;
