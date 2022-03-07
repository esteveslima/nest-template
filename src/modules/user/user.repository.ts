// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { IParamsRepositoryModifyUser } from './interfaces/repository/modify-user.interface';
import { IParamsRepositoryRegisterUser } from './interfaces/repository/register-user.interface';
import { IParamsRepositorySearchUser } from './interfaces/repository/search-user.interface';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async registerUser(user: IParamsRepositoryRegisterUser): Promise<UserEntity> {
    const registerOperation = this.create(user);

    try {
      const userRegistered = await this.save(registerOperation);
      return userRegistered;
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: create response interface that includes an error object, to avoid throwing Errors from this project's layer
      return undefined;
    }
  }

  async getUserById(uuid: string): Promise<UserEntity | undefined> {
    if (!uuid) return undefined;
    const userFound = await this.findOne(uuid, { loadRelationIds: true });

    return userFound;
  }

  async deleteUserById(uuid: string): Promise<boolean> {
    const deleteResult = await this.delete(uuid);

    const isOperationSuccessful = deleteResult.affected > 0;

    return isOperationSuccessful;
  }

  async modifyUserById(
    uuid: string,
    user: IParamsRepositoryModifyUser,
  ): Promise<boolean> {
    try {
      const userModified = await this.update(uuid, user); // using user as criteria to allow only the owner
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

    const query = this.createQueryBuilder('user');

    // add conditions to search
    if (email) {
      query.andWhere('user.email = :email', { email });
    }
    if (username) {
      query.andWhere('user.username = :username', { username });
    }

    const searchResult = await query.getMany();

    return searchResult;
  }
}
