// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { IUser } from '../entity/user.interface';

export type IParamsRepositorySearchUser = Partial<
  Pick<IUser, 'username' | 'email'>
>;
