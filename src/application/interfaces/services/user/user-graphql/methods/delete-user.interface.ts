import { User } from 'src/domain/entities/user';

export type IUserGraphqlServiceDeleteUserParams = Pick<User, 'id'>;

export type IUserGraphqlServiceDeleteUserResult = void;
