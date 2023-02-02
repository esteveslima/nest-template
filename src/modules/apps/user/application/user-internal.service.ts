// Helper methods decoupled to be used only internally and not exposed to users

import { Injectable } from '@nestjs/common';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { IHashGateway } from './interfaces/ports/hash/hash-gateway.interface';
import { IUserGateway } from '../domain/repositories/user/user-gateway.interface';
import { IUserInternalService } from './interfaces/services/user-internal/user-internal.interface';
import {
  IUserInternalServiceSearchUserParams,
  IUserInternalServiceSearchUserResult,
} from './interfaces/services/user-internal/methods/search-user.interface';
import {
  IUserInternalServiceVerifyUserPasswordParams,
  IUserInternalServiceVerifyUserPasswordResult,
} from './interfaces/services/user-internal/methods/verify-user-password.interface';

@Injectable()
export class UserInternalService implements IUserInternalService {
  // Get services and repositories from DI
  constructor(
    private userGateway: IUserGateway,
    private hashGateway: IHashGateway,
  ) {}

  // Define methods containing business logic

  async searchUser(
    params: IUserInternalServiceSearchUserParams,
  ): Promise<IUserInternalServiceSearchUserResult> {
    const { email, username } = params;

    const hasSearchParams = !!username || !!email;
    if (!hasSearchParams) {
      throw new CustomException('UserSearchInvalidFilters');
    }

    const usersFound = await this.userGateway.searchUsers({ email, username });
    const userFound = usersFound[0];
    if (!userFound) throw new CustomException('UserNotFound');

    return userFound;
  }

  async verifyUserPassword(
    params: IUserInternalServiceVerifyUserPasswordParams,
  ): Promise<IUserInternalServiceVerifyUserPasswordResult> {
    const { username, password } = params;

    const hasParameters = !!username && !!password;
    if (!hasParameters) return false;

    const usersFound = await this.userGateway.searchUsers({ username });
    const userFound = usersFound[0];
    if (!userFound) return false;

    const userHashPassword = userFound.password;
    const isValidPassword = await this.hashGateway.compareHash({
      hash: userHashPassword,
      value: password,
    });

    return isValidPassword;
  }
}
