// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { SINGLE_DB } from 'src/modules/setup/db/constants';
import {
  DeleteResult,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { IParamsRepositoryModifyUser } from '../../../../interfaces/services/adapters/database/repositories/user/methods/modify-user.interface';
import { IParamsRepositoryRegisterUser } from '../../../../interfaces/services/adapters/database/repositories/user/methods/register-user.interface';
import { IParamsRepositorySearchUser } from '../../../../interfaces/services/adapters/database/repositories/user/methods/search-user.interface';
import { UserEntity } from '../../../../models/user.entity';

//TODO: interface for whole classes composing the interfaces for it's methods(which have isolated interfaces), use colocation
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity, SINGLE_DB)
    private repository: Repository<UserEntity>,
  ) {}

  async registerUser(user: IParamsRepositoryRegisterUser): Promise<UserEntity> {
    try {
      const registerOperation = this.repository.create(user);
      const userRegistered = await this.repository.save(registerOperation);
      return userRegistered;
    } catch (e) {
      Logger.error(e);
      if (e instanceof QueryFailedError) {
        if (e.driverError.code === '23505') {
          throw new CustomException('UserAlreadyExists');
        }
      }
      throw e;
    }
  }

  async getUserById(uuid: string): Promise<UserEntity> {
    const userFound = await this.repository.findOne(uuid, {
      loadRelationIds: true,
    });

    if (!userFound) {
      throw new CustomException('UserNotFound');
    }
    return userFound;
  }

  async deleteUserById(uuid: string): Promise<void> {
    const deleteResult = await this.repository.delete(uuid);

    const isOperationSuccessful = deleteResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new CustomException('UserNotFound');
    }
  }

  async modifyUserById(
    uuid: string,
    user: IParamsRepositoryModifyUser,
  ): Promise<void> {
    let updateResult: UpdateResult;
    try {
      updateResult = await this.repository.update(uuid, user); // using user as criteria to allow only the owner
    } catch (e) {
      Logger.error(e);
      if (e instanceof QueryFailedError) {
        if (e.driverError.code === '22P02') {
          throw new CustomException('UserUpdateFail');
        }
      }
      throw e;
    }

    const isOperationSuccessful = updateResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new CustomException('UserNotFound');
    }

    return;
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
