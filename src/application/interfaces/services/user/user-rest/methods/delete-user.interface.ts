import { User } from 'src/domain/entities/user';

export type IUserRestServiceDeleteUserParams = Pick<User, 'id'>;

export type IUserRestServiceDeleteUserResult = void;
