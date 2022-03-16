// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { IUser } from 'src/modules/apps/user/interfaces/models/entities/user-entity.interface';

export type IParamsRepositorySearchUser = Partial<
  Pick<IUser, 'username' | 'email'>
>;
