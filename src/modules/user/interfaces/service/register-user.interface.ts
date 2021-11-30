// Interface for service methods
// May extend Entity and modify or omit certain properties to match the operation

import { UserEntity } from '../../user.entity';

export type IParamsServiceRegisterUser = Omit<
  UserEntity,
  'id' | 'createdAt' | 'updatedAt'
>;

export type IResultServiceRegisterUser = Omit<
  UserEntity,
  'updatedAt' | 'password'
>;
