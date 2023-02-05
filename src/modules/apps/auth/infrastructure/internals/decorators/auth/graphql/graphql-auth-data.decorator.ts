// Decorator to apply interceptor that gets user info for graphql operations that have mixed permissions on model fields and aren't behind an auth guard

import { UseInterceptors } from '@nestjs/common';
import { GraphqlAuthDataInterceptor } from '../../../enhancers/interceptors/graphql-auth-data.interceptor';

export const GetGraphqlAuthData = () =>
  UseInterceptors(GraphqlAuthDataInterceptor);
