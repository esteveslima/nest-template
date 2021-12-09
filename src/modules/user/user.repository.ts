// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { EntityRepository, Repository } from 'typeorm';
import { IParamsRepositoryModifyUser } from './interfaces/repository/modify-user.interface';
import { IParamsRepositoryRegisterUser } from './interfaces/repository/register-user.interface';
import { IParamsRepositorySearchUser } from './interfaces/repository/search-user.interface';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async registerUser(user: IParamsRepositoryRegisterUser): Promise<UserEntity> {
    const registerOperation = this.create(user);

    const userRegistered = await this.save(registerOperation);

    return userRegistered;
  }

  async getUserById(uuid: string): Promise<UserEntity | undefined> {
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
    const userModified = await this.update(uuid, user);

    const isOperationSuccessful = userModified.affected > 0;

    return isOperationSuccessful;
  }

  async searchUser(
    searchFilters: IParamsRepositorySearchUser,
  ): Promise<UserEntity> {
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

    return searchResult[0];
  }
}
