// Responsible for containing business logic(decoupled for graphql resolvers)

import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../models/user.entity';
import { RegisterUserArgsDTO } from '../../dtos/graphql/args/register-user.args';
import { UpdateUserArgsDTO } from '../../dtos/graphql/args/update-user.args';
import { SearchUserArgsDTO } from '../../dtos/graphql/args/search-user.args';
import { UpdateCurrentUserArgsDTO } from '../../dtos/graphql/args/update-current-user.args';
import { HashService } from '../utils/hash.service';
import { UserRepository } from '../database/repositories/user.repository';

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

    if (!userCreated) {
      throw new NotAcceptableException('Registration data not accepted');
    }

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
    if (!uuid) return undefined;
    const userFound = await this.userRepository.getUserById(uuid);
    if (!userFound) throw new NotFoundException();

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
    if (user.password)
      user.password = await this.hashService.hashValue(user.password);

    const modifyResult = await this.userRepository.modifyUserById(uuid, user);
    if (modifyResult === undefined) {
      throw new NotAcceptableException('Update data not accepted');
    }
    if (modifyResult === false) {
      throw new NotFoundException();
    }

    return;
  }

  //TODO: forbid delete id from current user
  async deleteUserById(uuid: string): Promise<void> {
    const isDeleted = await this.userRepository.deleteUserById(uuid);
    if (!isDeleted) throw new NotFoundException();

    return;
  }

  async searchUserEntity(
    searchUserFilters: SearchUserArgsDTO,
  ): Promise<UserEntity[]> {
    const usersFound = await this.userRepository.searchUser(searchUserFilters);

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
