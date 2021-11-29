// Responsible for containing business logic

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import {
  IParamsServiceRegisterUser,
  IResultServiceRegisterUser,
} from './interfaces/service/register-user.interface';
import { IResultServiceGetUser } from './interfaces/service/get-user.interface';
import { IParamsServiceModifyUser } from './interfaces/service/modify-user.interface';
import {
  IParamsServiceSearchUser,
  IResultServiceSearchUser,
} from './interfaces/service/search-user.interface';

@Injectable()
export class UserService {
  // Get services and repositories from DI
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  // Define methods containing business logic

  async registerUser(
    user: IParamsServiceRegisterUser,
  ): Promise<IResultServiceRegisterUser> {
    const userCreated = await this.userRepository.registerUser({
      ...user,
      password: await this.hashValue(user.password),
    });

    const { updatedAt, password, ...returnObject } = userCreated;

    return returnObject;
  }

  async getUserById(uuid: string): Promise<IResultServiceGetUser> {
    const userFound = await this.userRepository.getUserById(uuid);

    const { updatedAt, password, ...returnObject } = userFound;

    return returnObject;
  }

  async deleteUserById(uuid: string): Promise<void> {
    await this.userRepository.deleteUserById(uuid);

    return;
  }

  async modifyUserById(
    uuid: string,
    user: IParamsServiceModifyUser,
  ): Promise<void> {
    if (user.password) user.password = await this.hashValue(user.password);

    await this.userRepository.modifyUserById(uuid, user);

    return;
  }

  async searchUser(
    searchUserFilters: IParamsServiceSearchUser,
  ): Promise<IResultServiceSearchUser> {
    const userFound = await this.userRepository.searchUser(searchUserFilters);

    if (!userFound) throw new NotFoundException();

    const { createdAt, updatedAt, password, gender, age, ...returnObject } =
      userFound;

    return returnObject;
  }

  async verifyUserPassword(
    username: string,
    password: string,
  ): Promise<boolean> {
    if (!username || !password) return false;

    const userFound = await this.userRepository.searchUser({ username });
    if (!userFound) throw new NotFoundException();

    const userHashPassword = userFound.password;

    return bcrypt.compare(password, userHashPassword);
  }

  private async hashValue(value: string): Promise<string> {
    if (!value) return undefined;
    return bcrypt.hash(value, 10);
  }
}
