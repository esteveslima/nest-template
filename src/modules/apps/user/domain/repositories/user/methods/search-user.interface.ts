// Interface for repository methods
// May extend Entity and modify or omit certain properties to match the operation

import { User } from '../../../entities/user';

export type IUserGatewaySearchUserParams = Partial<
  Pick<User, 'username' | 'email'>
>;
