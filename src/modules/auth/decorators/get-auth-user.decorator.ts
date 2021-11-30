// Create decorator to return the authenticated user found after jwt validation

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IResultServiceSearchUser } from '../../user/interfaces/service/search-user.interface';

export const GetAuthUser = createParamDecorator(
  (data: never, context: ExecutionContext): IResultServiceSearchUser => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
