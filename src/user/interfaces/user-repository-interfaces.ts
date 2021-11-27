import { UserEntity } from '../user.entity';

// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

// Params

export type IParamsRepositoryRegisterUser = Omit<
  UserEntity,
  'id' | 'createdAt' | 'updatedAt'
>;

export type IParamsRepositoryModifyUser = Partial<
  Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>
>;

export type IParamsRepositorySearchUser = Partial<
  Pick<UserEntity, 'username' | 'email'>
>;

// Result
