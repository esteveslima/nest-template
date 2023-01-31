// Custom Pipe for the decorator to get user entity
// It gets the user's jwtPayload set by auth.guard on the request object, finally finding and piping the related entity at the receiving parameter

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Inject,
  ExecutionContext,
} from '@nestjs/common';
import { getRequestObject } from 'src/common/internals/enhancers/utils/get-request-object';
import { UserInternalService } from 'src/modules/apps/user/application/user-internal.service';

@Injectable()
export class GetAuthUserPipe implements PipeTransform {
  constructor(
    @Inject(UserInternalService)
    private userInternalService: UserInternalService,
  ) {}

  async transform(value: ExecutionContext, metadata: ArgumentMetadata) {
    const context = value;
    const req = getRequestObject(context);
    const { user } = req;
    const searchUserFilters = { email: user.email, username: user.name };

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
