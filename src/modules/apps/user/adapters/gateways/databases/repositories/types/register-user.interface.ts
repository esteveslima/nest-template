// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { User } from '../../../../../domain/user.interface';

export type IParamsRepositoryRegisterUser = Pick<
  User,
  'username' | 'password' | 'email' | 'role' | 'gender' | 'age'
>;
