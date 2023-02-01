// Responsible for containing business logic(decoupled for graphql resolvers)

import { Injectable } from '@nestjs/common';
import { RegisterUserArgsDTO } from '../adapters/entrypoints/resolvers/dtos/args/register-user.args';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { UpdateCurrentUserArgsDTO } from '../adapters/entrypoints/resolvers/dtos/args/update-current-user.args';
import { UpdateUserArgsDTO } from '../adapters/entrypoints/resolvers/dtos/args/update-user.args';
import { SearchUserArgsDTO } from '../adapters/entrypoints/resolvers/dtos/args/search-user.args';
import { IHashGateway } from './interfaces/ports/hash/hash-gateway.interface';
import { User } from '../domain/entities/user';
import { IUserGateway } from '../domain/repositories/user/user-gateway.interface';

@Injectable()
export class UserGraphqlService {
  // Get services and repositories from DI
  constructor(
    private userGateway: IUserGateway,
    private hashGateway: IHashGateway,
  ) {}

  // Define methods containing business logic

  // TODO: public registration aways creates with role 'USER', for role 'ADMIN' must be creted by other authorized admin
  async registerUser(user: RegisterUserArgsDTO): Promise<User> {
    const { age, email, gender, password, role, username } = user;

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

  async getUser(uuid: string): Promise<User> {
    const userFound = await this.userGateway.getUser({ id: uuid });

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
    uuid: string,
    user: UpdateUserArgsDTO | UpdateCurrentUserArgsDTO,
  ): Promise<void> {
    if (user.password) {
      user.password = await this.hashGateway.hashValue({
        value: user.password,
      });
    }

    await this.userGateway.modifyUser({ data: user, indexes: { id: uuid } });

    return;
  }

  //TODO: forbid delete id from current user
  async deleteUser(uuid: string): Promise<void> {
    await this.userGateway.deleteUser({ id: uuid });

    return;
  }

  async searchUserEntity(
    searchUserFilters: SearchUserArgsDTO,
  ): Promise<User[]> {
    const usersFound = await this.userGateway.searchUser(searchUserFilters);

    if (usersFound.length <= 0) {
      throw new CustomException('UserNotFound');
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
