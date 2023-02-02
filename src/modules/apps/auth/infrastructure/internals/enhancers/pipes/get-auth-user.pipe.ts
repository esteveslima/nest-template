// Custom Pipe for the decorator to get user entity
// It gets the user's jwtPayload set by auth.guard on the request object, finally finding and piping the related entity at the receiving parameter

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Inject,
  ExecutionContext,
} from '@nestjs/common';
import { getRequestObject } from 'src/modules/apps/auth/infrastructure/internals/enhancers/utils/get-request-object';
import { UserInternalService } from 'src/modules/apps/user/application/user-internal.service';
import { User } from 'src/modules/apps/user/domain/entities/user';

@Injectable()
export class GetAuthUserPipe implements PipeTransform {
  constructor(
    @Inject(UserInternalService)
    private userInternalService: UserInternalService,
  ) {}

  async transform(
    value: ExecutionContext,
    metadata: ArgumentMetadata,
  ): Promise<User> {
    const context = value;
    const req = getRequestObject(context);
    const { authData } = req;
    const searchUserFilters = {
      email: authData.email,
      username: authData.name,
    };

    // Fails if somehow doesnt receive all parameters for search
    if (Object.values(searchUserFilters).includes(undefined)) {
      throw new Error('GetAuthUserPipe: search parameters not found');
    }

    const userFound = await this.userInternalService.searchUser(
      searchUserFilters,
    );
    if (!userFound) {
      throw new Error('GetAuthUserPipe: entity parameters not found');
    }

    return userFound;
  }
}
