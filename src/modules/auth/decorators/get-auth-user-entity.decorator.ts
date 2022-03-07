// Create decorator to return the authenticated user found after jwt validation, finally fetching its entity object
// It applies the custom pipe on the result value from the param decorator(IAuthUser), to finally result in the pipe's result for the decorator(UserEntity)

// the currying still allows to pass data into the decorator

import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IResolvedRequest } from 'src/common/interceptors/interfaces/resolved-request.interface';
import { IAuthUser } from '../interfaces/user/user.interface';
import { GetAuthUserEntityPipe } from '../pipes/get-auth-user-entity.pipe';

//TODO: create separated files for graphql context? For now, it's just replicating code
const getReq = (context: ExecutionContext): IResolvedRequest => {
  const contextType = context.getType() as string;
  switch (contextType) {
    case 'http': {
      const req = context.switchToHttp().getRequest<IResolvedRequest>();
      return req;
    }
    case 'graphql': {
      const gqlContext = GqlExecutionContext.create(context);
      const { req } = gqlContext.getContext<{ req: IResolvedRequest }>();
      return req;
    }
    default: {
      throw new InternalServerErrorException('Invalid log request context');
    }
  }
};

export const GetAuthUserEntity = (data = undefined) =>
  createParamDecorator((data: never, context: ExecutionContext): IAuthUser => {
    const req = getReq(context); //context.switchToHttp().getRequest();
    return req.user;
  })(data, GetAuthUserEntityPipe);
