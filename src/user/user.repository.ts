// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { NotFoundException } from '@nestjs/common';
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

  async getUserById(uuid: string): Promise<UserEntity> {
    const userFound = await this.findOne(uuid);
    //TODO: return media list
    if (!userFound) throw new NotFoundException();

    return userFound;
  }

  async deleteUserById(uuid: string): Promise<void> {
    const deleteResult = await this.delete(uuid);

    if (deleteResult.affected <= 0) throw new NotFoundException();

    return;
  }

  async modifyUserById(
    uuid: string,
    user: IParamsRepositoryModifyUser,
  ): Promise<void> {
    const userModified = await this.update(uuid, user);

    if (userModified.affected <= 0) throw new NotFoundException();

    return;
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
