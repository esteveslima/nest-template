// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SINGLE_DB } from 'src/modules/setup/db/constants';
import { Repository } from 'typeorm';

import { IParamsRepositoryModifyUser } from '../../../interfaces/services/database/repositories/user/methods/modify-user.interface';
import { IParamsRepositoryRegisterUser } from '../../../interfaces/services/database/repositories/user/methods/register-user.interface';
import { IParamsRepositorySearchUser } from '../../../interfaces/services/database/repositories/user/methods/search-user.interface';

import { UserEntity } from '../../../models/user.entity';
//TODO: interface for whole classes composing the interfaces for it's methods(which have isolated interfaces)

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity, SINGLE_DB)
    private repository: Repository<UserEntity>,
  ) {}

  async registerUser(user: IParamsRepositoryRegisterUser): Promise<UserEntity> {
    const registerOperation = this.repository.create(user);

    try {
      const userRegistered = await this.repository.save(registerOperation);
      return userRegistered;
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: create response interface that includes an error object, to avoid throwing Errors from this project's layer
      return undefined;
    }
  }

  async getUserById(uuid: string): Promise<UserEntity | undefined> {
    if (!uuid) return undefined;
    const userFound = await this.repository.findOne(uuid, {
      loadRelationIds: true,
    });

    return userFound;
  }

  async deleteUserById(uuid: string): Promise<boolean> {
    const deleteResult = await this.repository.delete(uuid);

    const isOperationSuccessful = deleteResult.affected > 0;

    return isOperationSuccessful;
  }

  async modifyUserById(
    uuid: string,
    user: IParamsRepositoryModifyUser,
  ): Promise<boolean> {
    try {
      const userModified = await this.repository.update(uuid, user); // using user as criteria to allow only the owner
      const isOperationSuccessful = userModified.affected > 0;
      return isOperationSuccessful;
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: create response interface that includes an error object, to avoid throwing Errors from this project's layer
      return undefined;
    }
  }

  async searchUser(
    searchFilters: IParamsRepositorySearchUser,
  ): Promise<UserEntity[]> {
    const { email, username } = searchFilters;

    const query = this.repository.createQueryBuilder('user');

    // add conditions to search
    if (email) {
      query.andWhere('user.email LIKE :email', {
        email: `%${email}%`,
      });
    }
    if (username) {
      query.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }

    const searchResult = await query.getMany();

    return searchResult;
  }
}
