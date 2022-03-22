// Responsible for data access logic in the database
// TypeORM Repository API: https://typeorm.io/#/repository-api

import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
      if (e instanceof QueryFailedError) {
        if (e.driverError.code === '23505') {
          throw new ConflictException(e.driverError.detail);
        }
      }
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }
  }

  async getUserById(uuid: string): Promise<UserEntity> {
    let userFound: UserEntity;
    try {
      userFound = await this.repository.findOne(uuid, {
        loadRelationIds: true,
      });
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }

    if (!userFound) {
      throw new NotFoundException(); // TODO: ideally it shouldn't be a http exception to provide proper isolation and separation of concerns, this was made due convenience to not having a specialized exception filter to map into http errors the custom uncaught thrown errors that bubbles up the call stack
    }
    return userFound;
  }

  async deleteUserById(uuid: string): Promise<void> {
    let deleteResult: DeleteResult;
    try {
      deleteResult = await this.repository.delete(uuid);
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }

    const isOperationSuccessful = deleteResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new NotFoundException(); // TODO: ideally it shouldn't be a http exception to provide proper isolation and separation of concerns, this was made due convenience to not having a specialized exception filter to map into http errors the custom uncaught thrown errors that bubbles up the call stack
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
      if (e instanceof QueryFailedError) {
        if (e.driverError.code === '22P02') {
          throw new NotAcceptableException('Update data not accepted');
        }
      }
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }

    const isOperationSuccessful = updateResult.affected > 0;
    if (!isOperationSuccessful) {
      throw new NotFoundException(); // TODO: ideally it shouldn't be a http exception to provide proper isolation and separation of concerns, this was made due convenience to not having a specialized exception filter to map into http errors the custom uncaught thrown errors that bubbles up the call stack
    }

    return;
  }

  async searchUser(
    searchFilters: IParamsRepositorySearchUser,
  ): Promise<UserEntity[]> {
    const { email, username } = searchFilters;

    let searchResult: UserEntity[];
    try {
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

      searchResult = await query.getMany();
    } catch (e) {
      Logger.log(JSON.stringify(e)); // TODO: link this log to the current request session(asynclocalstorage?)
      throw new Error(`${e}`); // Generic error with simple message for uncaught exceptions, forcing to implement proper error handling if is catched by other layers
    }

    return searchResult;
  }
}
