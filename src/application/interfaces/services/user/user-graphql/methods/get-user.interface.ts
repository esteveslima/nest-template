import { User } from 'src/domain/entities/user';

export type IUserGraphqlServiceGetUserParams = Pick<User, 'id'>;

export type IUserGraphqlServiceGetUserResult = User;
