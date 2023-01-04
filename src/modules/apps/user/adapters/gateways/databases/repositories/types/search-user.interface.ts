// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { User } from '../../../../../domain/user.interface';

export type IParamsRepositorySearchUser = Partial<
  Pick<User, 'username' | 'email'>
>;
