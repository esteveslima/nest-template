// Custom Pipe for the decorator to get user entity
// It gets the user's jwtPayload set by auth.guard on the request object, finally finding and piping the related entity at the receiving parameter

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Inject,
  ExecutionContext,
} from '@nestjs/common';
import { UserInternalService } from 'src/application/services/user/user-internal.service';
import { User } from 'src/domain/entities/user';
import { getRequestObject } from '../../utils/get-request-object';

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
      username: authData.username,
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
