// Create decorator to pass the executing context to a custom pipe that returns the user entity
// authenticated user found after jwt validation on the request object It applies the custom pipe on the result value from the param decorator(IAuthUserInfo), to finally result in the pipe's result for the decorator(UserEntity)

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetAuthUserPipe } from '../../enhancers/pipes/get-auth-user-entity.pipe';

export const GetAuthUser = (data: any = undefined) =>
  createParamDecorator((data: never, context: ExecutionContext) => {
    return context; // Data received by pipe
  })(data, GetAuthUserPipe);
// the currying still allows to pass data into the decorator
