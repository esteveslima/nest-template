// Interface for repository method
// May extend Entity and modify or omit certain properties to match the operation

import { User } from '../../../entities/user';

export type IUserGatewayGetUserParams = Pick<User, 'id'>;
