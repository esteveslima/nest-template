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
import { UserDatabaseModel } from '../models/user.model';
import { User } from 'src/modules/apps/user/domain/entities/user';
import { IUserGateway } from 'src/modules/apps/user/domain/repositories/user/user-gateway.interface';
import { IUserGatewayRegisterUserParams } from 'src/modules/apps/user/domain/repositories/user/methods/register-user.interface';
import { IUserGatewaySearchUserParams } from 'src/modules/apps/user/domain/repositories/user/methods/search-user.interface';
import { IUserGatewayModifyUserParams } from 'src/modules/apps/user/domain/repositories/user/methods/modify-user.interface';
import { IUserGatewayDeleteUserParams } from 'src/modules/apps/user/domain/repositories/user/methods/delete-user.interface';
import { IUserGatewayGetUserParams } from 'src/modules/apps/user/domain/repositories/user/methods/get-user.interface';

//TODO: interface for whole classes composing the interfaces for it's methods(which have isolated interfaces), use colocation
@Injectable()
export class UserDatabaseRepositoryGateway implements IUserGateway {
  constructor(
    @InjectRepository(UserDatabaseModel, SINGLE_DB)
    private repository: Repository<UserDatabaseModel>,
  ) {}

  async registerUser(params: IUserGatewayRegisterUserParams): Promise<User> {
    const { age, email, gender, password, role, username } = params;

    try {
      const registerOperation = this.repository.create({
        age,
        email,
        gender,
        password,
        role,
        username,
      });
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

  async getUser(params: IUserGatewayGetUserParams): Promise<User> {
    const { id: uuid } = params;

    const userFound = await this.repository.findOne(uuid, {
      loadRelationIds: true,
    });

    if (!userFound) {
      throw new CustomException('UserNotFound');
    }

    return userFound;
  }

  async searchUser(params: IUserGatewaySearchUserParams): Promise<User[]> {
    const { email, username } = params;

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

  async modifyUser(params: IUserGatewayModifyUserParams): Promise<void> {
    const { data, indexes } = params;
    const { id: uuid } = indexes;
    const { age, email, gender, password, username } = data;

    let updateResult: UpdateResult;
    try {
      updateResult = await this.repository.update(uuid, {
        age,
        email,
        gender,
        password,
        username,
      }); // using user as criteria to allow only the owner
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

  async deleteUser(params: IUserGatewayDeleteUserParams): Promise<void> {
    const { id: uuid } = params;

    const deleteResult = await this.repository.delete(uuid);

    const isOperationSuccessful = deleteResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new CustomException('UserNotFound');
    }
  }
}
