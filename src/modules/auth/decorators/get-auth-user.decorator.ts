// Create decorator to return the authenticated user found after jwt validation

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SearchUserResDTO } from 'src/modules/user/dto/res/search-user-res.dto';

export const GetAuthUser = createParamDecorator(
  (data: never, context: ExecutionContext): SearchUserResDTO => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
