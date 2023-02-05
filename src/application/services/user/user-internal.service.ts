// Helper methods decoupled to be used only internally and not exposed to users

import { Injectable } from '@nestjs/common';
import { UserSearchInvalidFiltersException } from 'src/application/exceptions/services/user/user-search-invalid-filters.exception';
import { IHashGateway } from 'src/application/interfaces/ports/hash/hash-gateway.interface';
import {
  IUserInternalServiceSearchUserParams,
  IUserInternalServiceSearchUserResult,
} from 'src/application/interfaces/services/user/user-internal/methods/search-user.interface';
import {
  IUserInternalServiceVerifyUserPasswordParams,
  IUserInternalServiceVerifyUserPasswordResult,
} from 'src/application/interfaces/services/user/user-internal/methods/verify-user-password.interface';
import { IUserInternalService } from 'src/application/interfaces/services/user/user-internal/user-internal.interface';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { IUserGateway } from 'src/domain/repositories/user/user-gateway.interface';

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
      throw new UserSearchInvalidFiltersException(params);
    }

    const usersFound = await this.userGateway.searchUsers({ email, username });
    const userFound = usersFound[0];
    if (!userFound) throw new UserNotFoundException(params);

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
