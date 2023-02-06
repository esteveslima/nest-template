// Responsible for containing business logic(decoupled for rest controllers)

import { Injectable } from '@nestjs/common';
import { UserSearchInvalidFiltersException } from 'src/application/exceptions/services/user/user-search-invalid-filters.exception';
import { IHashGateway } from 'src/application/interfaces/ports/hash/hash-gateway.interface';
import {
  IUserRestServiceDeleteUserParams,
  IUserRestServiceDeleteUserResult,
} from 'src/application/interfaces/services/user/user-rest/methods/delete-user.interface';
import {
  IUserRestServiceGetUserParams,
  IUserRestServiceGetUserResult,
} from 'src/application/interfaces/services/user/user-rest/methods/get-user.interface';
import {
  IUserRestServiceModifyUserParams,
  IUserRestServiceModifyUserResult,
} from 'src/application/interfaces/services/user/user-rest/methods/modify-user.interface';
import {
  IUserRestServiceRegisterUserParams,
  IUserRestServiceRegisterUserResult,
} from 'src/application/interfaces/services/user/user-rest/methods/register-user.interface';
import {
  IUserRestServiceSearchUsersParams,
  IUserRestServiceSearchUsersResult,
} from 'src/application/interfaces/services/user/user-rest/methods/search-users.interface';
import { IUserRestService } from 'src/application/interfaces/services/user/user-rest/user-rest.interface';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { IUserGateway } from 'src/domain/repositories/user/user-gateway.interface';

@Injectable()
export class UserRestService implements IUserRestService {
  // TODO: refactor into usecase format with one method per class(?)

  // Get services and repositories from DI
  constructor(
    private userGateway: IUserGateway,
    private hashGateway: IHashGateway,
  ) {}

  // Define methods containing business logic

  // TODO: public registration aways creates with role 'USER', for role 'ADMIN' must be creted by other authorized admin
  async registerUser(
    params: IUserRestServiceRegisterUserParams,
  ): Promise<IUserRestServiceRegisterUserResult> {
    const { age, email, gender, password, role, username } = params;

    const hashedPassword = await this.hashGateway.hashValue({
      value: password,
    });

    const userCreated = await this.userGateway.registerUser({
      age,
      email,
      gender,
      role,
      username,
      password: hashedPassword,
    });

    return {
      age: userCreated.age,
      email: userCreated.email,
      gender: userCreated.gender,
      id: userCreated.id,
      medias: userCreated.medias,
      role: userCreated.role,
      username: userCreated.username,
    };
  }

  async getUser(
    params: IUserRestServiceGetUserParams,
  ): Promise<IUserRestServiceGetUserResult> {
    const { id } = params;

    const userFound = await this.userGateway.getUser({ id });

    return {
      age: userFound.age,
      createdAt: userFound.createdAt,
      email: userFound.email,
      gender: userFound.gender,
      id: userFound.id,
      medias: userFound.medias,
      role: userFound.role,
      username: userFound.username,
    };
  }

  async searchUsers(
    params: IUserRestServiceSearchUsersParams,
  ): Promise<IUserRestServiceSearchUsersResult> {
    const searchUserFilters = params;
    if (Object.keys(searchUserFilters).length <= 0) {
      throw new UserSearchInvalidFiltersException(searchUserFilters);
    }

    const { email, username } = searchUserFilters;

    const usersFound = await this.userGateway.searchUsers({ email, username });

    const foundUser = usersFound.length > 0;
    if (!foundUser) {
      throw new UserNotFoundException(searchUserFilters);
    }

    const formattedUsersFound = usersFound.map((user) => ({
      email: user.email,
      id: user.id,
      medias: user.medias,
      role: user.role,
      username: user.username,
    }));

    return formattedUsersFound;
  }

  async modifyUser(
    params: IUserRestServiceModifyUserParams,
  ): Promise<IUserRestServiceModifyUserResult> {
    const { data, indexes } = params;
    const { id } = indexes;
    const { age, email, gender, password, username } = data;

    const hasModifiedPassword = !!password;
    let hashedPassword: string;
    if (hasModifiedPassword) {
      hashedPassword = await this.hashGateway.hashValue({
        value: password,
      });
    }

    await this.userGateway.modifyUser({
      indexes: { id },
      data: { age, email, gender, username, password: hashedPassword },
    });

    return;
  }

  //TODO: forbid delete id from current user
  async deleteUser(
    params: IUserRestServiceDeleteUserParams,
  ): Promise<IUserRestServiceDeleteUserResult> {
    const { id } = params;

    await this.userGateway.deleteUser({ id });

    return;
  }
}
