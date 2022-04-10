// Responsible for containing business logic(decoupled for graphql resolvers)

import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../models/user.entity';
import { RegisterUserArgsDTO } from '../../dtos/graphql/args/register-user.args';
import { UpdateUserArgsDTO } from '../../dtos/graphql/args/update-user.args';
import { SearchUserArgsDTO } from '../../dtos/graphql/args/search-user.args';
import { UpdateCurrentUserArgsDTO } from '../../dtos/graphql/args/update-current-user.args';
import { HashService } from '../adapters/clients/hash.service';
import { UserRepository } from '../adapters/database/repositories/user.repository';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';

@Injectable()
export class UserGraphqlService {
  // Get services and repositories from DI
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
  ) {}

  // Define methods containing business logic

  // TODO: public registration aways creates with role 'USER', for role 'ADMIN' must be creted by other authorized admin
  async registerUser(user: RegisterUserArgsDTO): Promise<UserEntity> {
    const userCreated = await this.userRepository.registerUser({
      ...user,
      password: await this.hashService.hashValue(user.password),
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

  async getUserById(uuid: string): Promise<UserEntity> {
    const userFound = await this.userRepository.getUserById(uuid);

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

  async modifyUserById(
    uuid: string,
    user: UpdateUserArgsDTO | UpdateCurrentUserArgsDTO,
  ): Promise<void> {
    if (user.password) {
      user.password = await this.hashService.hashValue(user.password);
    }

    await this.userRepository.modifyUserById(uuid, user);

    return;
  }

  //TODO: forbid delete id from current user
  async deleteUserById(uuid: string): Promise<void> {
    await this.userRepository.deleteUserById(uuid);

    return;
  }

  async searchUsersEntity(
    searchUsersFilters: SearchUserArgsDTO,
  ): Promise<UserEntity[]> {
    const usersFound = await this.userRepository.searchUser(searchUsersFilters);

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
