import { User } from 'src/domain/entities/user';

export interface IAuthRestServiceAuthLoginParams {
  username: User['username'];
  password: User['password'];
}

export interface IAuthRestServiceAuthLoginResult {
  token: string;
}
