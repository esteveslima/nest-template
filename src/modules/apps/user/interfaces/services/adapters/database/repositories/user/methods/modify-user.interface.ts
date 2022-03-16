// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { IUser } from '../../../../../../models/entities/user-entity.interface';
//TODO: compress the interface for te entire method, not only for parameters/response, this way it makes the code cleaner
export type IParamsRepositoryModifyUser = Partial<
  Pick<IUser, 'username' | 'password' | 'email' | 'gender' | 'age'>
>;
