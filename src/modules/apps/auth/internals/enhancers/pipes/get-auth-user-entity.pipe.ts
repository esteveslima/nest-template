// Custom Pipe for the decorator to get user entity
// It gets the user's jwtPayload on the request object set by auth.guard, finally finding and piping the related entity o the receiving parameter

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Inject,
  NotFoundException,
  ExecutionContext,
} from '@nestjs/common';
import { getRequestObject } from 'src/common/internals/enhancers/utils/get-request-object';
import { UserInternalService } from 'src/modules/apps/user/services/domain/user-internal.service';

@Injectable()
export class GetAuthUserEntityPipe implements PipeTransform {
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
      throw new NotFoundException('User entity search parameters not found');
    }

    const userFound = await this.userInternalService.searchUserEntity(
      searchUserFilters,
    );
    if (!userFound) {
      throw new NotFoundException('User entity not found');
    }

    return userFound;
  }
}
