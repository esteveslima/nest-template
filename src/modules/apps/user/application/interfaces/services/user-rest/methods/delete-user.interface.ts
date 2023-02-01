import { User } from 'src/modules/apps/user/domain/entities/user';

export type IUserRestServiceDeleteUserParams = Pick<User, 'id'>;

export type IUserRestServiceDeleteUserResult = void;
