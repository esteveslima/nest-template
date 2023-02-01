// Responsible for containing business logic(decoupled for rest controllers)

import { Injectable } from '@nestjs/common';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { IUserGateway } from '../domain/repositories/user/user-gateway.interface';
import { IHashGateway } from './interfaces/ports/hash/hash-gateway.interface';
import {
  IUserRestServiceDeleteUserParams,
  IUserRestServiceDeleteUserResult,
} from './interfaces/services/user-rest/methods/delete-user.interface';
import {
  IUserRestServiceGetUserParams,
  IUserRestServiceGetUserResult,
} from './interfaces/services/user-rest/methods/get-user.interface';
import {
  IUserRestServiceModifyUserParams,
  IUserRestServiceModifyUserResult,
} from './interfaces/services/user-rest/methods/modify-user.interface';
import {
  IUserRestServiceRegisterUserParams,
  IUserRestServiceRegisterUserResult,
} from './interfaces/services/user-rest/methods/register-user.interface';
import {
  IUserRestServiceSearchUserParams,
  IUserRestServiceSearchUserResult,
} from './interfaces/services/user-rest/methods/search-user.interface';
import { IUserRestService } from './interfaces/services/user-rest/user-rest.interface';

@Injectable()
export class UserRestService implements IUserRestService {
  // TODO: split methods in multiple files(?)(this way it can remain a generic name 'UserRestService' and only define the methods imported from other files): https://stackoverflow.com/questions/23876782/how-do-i-split-a-typescript-class-into-multiple-files

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
    const { id: uuid } = params;

    const userFound = await this.userGateway.getUser({ id: uuid });

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

  async searchUser(
    params: IUserRestServiceSearchUserParams,
  ): Promise<IUserRestServiceSearchUserResult> {
    const searchUserFilters = params;
    if (Object.keys(searchUserFilters).length <= 0) {
      throw new CustomException('UserSearchInvalidFilters');
    }

    const { email, username } = searchUserFilters;

    const usersFound = await this.userGateway.searchUser({ email, username });

    if (usersFound.length <= 0) {
      throw new CustomException('UserNotFound');
    }

    return usersFound.map((user) => ({
      email: user.email,
      id: user.id,
      medias: user.medias,
      role: user.role,
      username: user.username,
    }));
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
    const { id: uuid } = params;

    await this.userGateway.deleteUser({ id: uuid });

    return;
  }
}
