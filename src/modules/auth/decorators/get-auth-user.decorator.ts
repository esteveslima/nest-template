// Create decorator to return the authenticated user found after jwt validation

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetUserResDTO } from 'src/modules/user/dto/res/get-user-res.dto';

export const GetAuthUser = createParamDecorator(
  (data: never, context: ExecutionContext): GetUserResDTO => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
