import { User } from 'src/domain/entities/user';

export interface IAuthGraphqlServiceAuthLoginParams {
  username: User['username'];
  password: User['password'];
}

export type IAuthGraphqlServiceAuthLoginResult = string;
