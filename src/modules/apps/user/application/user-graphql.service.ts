// Responsible for containing business logic(decoupled for graphql resolvers)

import { Injectable } from '@nestjs/common';
import { RegisterUserArgsDTO } from '../adapters/entrypoints/resolvers/dtos/args/register-user.args';
import { CustomException } from 'src/common/exceptions/custom-exception';
import { UpdateCurrentUserArgsDTO } from '../adapters/entrypoints/resolvers/dtos/args/update-current-user.args';
import { UpdateUserArgsDTO } from '../adapters/entrypoints/resolvers/dtos/args/update-user.args';
import { SearchUserArgsDTO } from '../adapters/entrypoints/resolvers/dtos/args/search-user.args';
import { IHashGateway } from './interfaces/ports/hash/hash-gateway.interface';
import { User } from '../domain/entities/user';
import { IUserGateway } from '../domain/repositories/user/user-gateway.interface';
import { IUserGraphqlService } from './interfaces/services/user-graphql/user-graphql.interface';
import {
  IUserGraphqlServiceRegisterUserParams,
  IUserGraphqlServiceRegisterUserResult,
} from './interfaces/services/user-graphql/methods/register-user.interface';
import {
  IUserGraphqlServiceGetUserParams,
  IUserGraphqlServiceGetUserResult,
} from './interfaces/services/user-graphql/methods/get-user.interface';
import {
  IUserGraphqlServiceSearchUsersParams,
  IUserGraphqlServiceSearchUsersResult,
} from './interfaces/services/user-graphql/methods/search-users.interface';
import {
  IUserGraphqlServiceModifyUserParams,
  IUserGraphqlServiceModifyUserResult,
} from './interfaces/services/user-graphql/methods/modify-user.interface';
import {
  IUserGraphqlServiceDeleteUserParams,
  IUserGraphqlServiceDeleteUserResult,
} from './interfaces/services/user-graphql/methods/delete-user.interface';
import { ApplicationExceptions } from 'src/common/exceptions/application-exceptions';

@Injectable()
export class UserGraphqlService implements IUserGraphqlService {
  // Get services and repositories from DI
  constructor(
    private userGateway: IUserGateway,
    private hashGateway: IHashGateway,
  ) {}

  // Define methods containing business logic

  // TODO: public registration aways creates with role 'USER', for role 'ADMIN' must be creted by other authorized admin
  async registerUser(
    params: IUserGraphqlServiceRegisterUserParams,
  ): Promise<IUserGraphqlServiceRegisterUserResult> {
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
      createdAt: userCreated.createdAt,
      email: userCreated.email,
      gender: userCreated.gender,
      id: userCreated.id,
      medias: userCreated.medias,
      password: undefined,
      role: userCreated.role,
      updatedAt: userCreated.updatedAt,
      username: userCreated.username,
    };
  }

  async getUser(
    params: IUserGraphqlServiceGetUserParams,
  ): Promise<IUserGraphqlServiceGetUserResult> {
    const { id } = params;

    const userFound = await this.userGateway.getUser({ id });

    return {
      age: userFound.age,
      createdAt: userFound.createdAt,
      email: userFound.email,
      gender: userFound.gender,
      id: userFound.id,
      medias: userFound.medias, // removing the relation field in attempt to avoid circular nested objects
      password: undefined,
      role: userFound.role,
      updatedAt: userFound.updatedAt,
      username: userFound.username,
    };
  }

  async modifyUser(
    params: IUserGraphqlServiceModifyUserParams,
  ): Promise<IUserGraphqlServiceModifyUserResult> {
    const { data, indexes } = params;
    const { age, email, gender, password, username } = data;
    const { id } = indexes;

    const hasModifiedPassword = !!password;
    let hashedPassword: string;
    if (hasModifiedPassword) {
      hashedPassword = await this.hashGateway.hashValue({
        value: password,
      });
    }

    await this.userGateway.modifyUser({
      data: { age, email, gender, username, password: hashedPassword },
      indexes: { id },
    });

    return;
  }

  //TODO: forbid delete id from current user
  async deleteUser(
    params: IUserGraphqlServiceDeleteUserParams,
  ): Promise<IUserGraphqlServiceDeleteUserResult> {
    const { id } = params;

    await this.userGateway.deleteUser({ id });

    return;
  }

  async searchUsers(
    params: IUserGraphqlServiceSearchUsersParams,
  ): Promise<IUserGraphqlServiceSearchUsersResult> {
    const { email, username } = params;

    const usersFound = await this.userGateway.searchUsers({ email, username });

    const foundUser = usersFound.length > 0;
    if (!foundUser) {
      throw new CustomException<ApplicationExceptions>('UserNotFound');
    }

    return usersFound.map((user) => ({
      age: user.age,
      createdAt: user.createdAt,
      email: user.email,
      gender: user.gender,
      id: user.id,
      medias: user.medias,
      password: undefined,
      role: user.role,
      updatedAt: user.updatedAt,
      username: user.username,
    }));
  }
}
