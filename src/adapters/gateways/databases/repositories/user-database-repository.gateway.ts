// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UserDatabaseModel } from '../models/user.model';
import { User } from 'src/domain/entities/user';
import { IUserGateway } from 'src/domain/repositories/user/user-gateway.interface';
import { IUserGatewayRegisterUserParams } from 'src/domain/repositories/user/methods/register-user.interface';
import { IUserGatewaySearchUsersParams } from 'src/domain/repositories/user/methods/search-users.interface';
import { IUserGatewayModifyUserParams } from 'src/domain/repositories/user/methods/modify-user.interface';
import { IUserGatewayDeleteUserParams } from 'src/domain/repositories/user/methods/delete-user.interface';
import { IUserGatewayGetUserParams } from 'src/domain/repositories/user/methods/get-user.interface';
import { SINGLE_DB } from 'src/infrastructure/config/modules/db/constants';
import { UserAlreadyExistsException } from 'src/domain/exceptions/user/user-already-exists.exception';
import { UserNotFoundException } from 'src/domain/exceptions/user/user-not-found.exception';
import { UserUpdateFailException } from 'src/domain/exceptions/user/user-update-fail.exception';

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
      if (e instanceof QueryFailedError) {
        if (e.driverError.code === '23505') {
          throw new UserAlreadyExistsException(
            { email, username },
            { email, username },
          );
        }
      }
      throw e;
    }
  }

  async getUser(params: IUserGatewayGetUserParams): Promise<User> {
    const { id } = params;

    const userFound = await this.repository.findOne({
      where: { id },
      loadRelationIds: true,
    });

    if (!userFound) {
      throw new UserNotFoundException(params);
    }

    return userFound;
  }

  async searchUsers(params: IUserGatewaySearchUsersParams): Promise<User[]> {
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
    const { id } = indexes;
    const { age, email, gender, password, username } = data;

    let updateResult: UpdateResult;
    try {
      updateResult = await this.repository.update(id, {
        age,
        email,
        gender,
        password,
        username,
      }); // using user as criteria to allow only the owner
    } catch (e) {
      if (e instanceof QueryFailedError) {
        if (e.driverError.code === '22P02') {
          throw new UserUpdateFailException(params);
        }
      }
      throw e;
    }

    const isOperationSuccessful = updateResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new UserNotFoundException(indexes);
    }

    return;
  }

  async deleteUser(params: IUserGatewayDeleteUserParams): Promise<void> {
    const { id } = params;

    const deleteResult = await this.repository.delete(id);

    const isOperationSuccessful = deleteResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new UserNotFoundException(params);
    }
  }
}
