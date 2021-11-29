// Interface for service methods
// May extend Entity and modify or omit certain properties to match the operation

import { UserEntity } from 'src/user/user.entity';

export type IParamsServiceModifyUser = Partial<
  Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>
>;
