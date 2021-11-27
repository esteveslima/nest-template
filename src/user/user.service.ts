// Responsible for containing business logic

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IParamsServiceModifyUser,
  IParamsServiceRegisterUser,
  IParamsServiceSearchUser,
  IResultServiceGetUser,
  IResultServiceRegisterUser,
  IResultServiceSearchUser,
} from './interfaces/user-service-interfaces';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

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

    const { updatedAt, password, ...returnObject } = userFound;

    return returnObject;
  }

  async getUserHashPassword(uuid: string): Promise<string> {
    const userFound = await this.userRepository.getUserById(uuid);

    const { password } = userFound;

    return password;
  }

  async hashValue(value: string): Promise<string> {
    if (!value) return undefined;
    return bcrypt.hash(value, 10);
  }
  async checkHash(value: string, hash: string): Promise<boolean> {
    if (!value || !hash) return false;
    return bcrypt.compare(value, hash);
  }
}
