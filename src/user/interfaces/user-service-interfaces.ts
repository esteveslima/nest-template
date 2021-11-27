import { UserEntity } from '../user.entity';

// Interface for service methods
// May extend Entity and modify or omit certain properties to match the operation

// Params

export type IParamsServiceRegisterUser = Omit<
  UserEntity,
  'id' | 'createdAt' | 'updatedAt'
>;

export type IParamsServiceModifyUser = Partial<
  Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>
>;

export type IParamsServiceSearchUser = Partial<
  Pick<UserEntity, 'username' | 'email'>
>;

// Result

export type IResultServiceRegisterUser = Omit<
  UserEntity,
  'updatedAt' | 'password'
>;

export type IResultServiceGetUser = Omit<UserEntity, 'updatedAt' | 'password'>;

export type IResultServiceSearchUser = Omit<
  UserEntity,
  'updatedAt' | 'password'
>;
