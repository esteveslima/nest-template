// Pipe to transform the decorator to get auth user param into user entity
// Created to simplify getting user entity using with a custom decorator

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { UserInternalService } from 'src/modules/user/user-internal.service';
import { IAuthUser } from '../interfaces/user/user.interface';

@Injectable()
export class GetAuthUserEntityPipe implements PipeTransform {
  constructor(
    @Inject(UserInternalService)
    private userInternalService: UserInternalService,
  ) {}

  async transform(value: IAuthUser, metadata: ArgumentMetadata) {
    const searchUserFilters = { email: value.email, username: value.name };

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
