import { User } from 'src/modules/apps/user/domain/entities/user';

export type IUserGraphqlServiceDeleteUserParams = Pick<User, 'id'>;

export type IUserGraphqlServiceDeleteUserResult = void;
