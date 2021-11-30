// Interface for service methods
// May extend Entity and modify or omit certain properties to match the operation

import { UserEntity } from '../../user.entity';

export type IParamsServiceSearchUser = Partial<
  Pick<UserEntity, 'username' | 'email'>
>;

export type IResultServiceSearchUser = Omit<
  UserEntity,
  'createdAt' | 'updatedAt' | 'password' | 'gender' | 'age'
>;
