// Responsible for containing business logic

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

import { RegisterUserReqDTO } from './dto/req/register-user-req.dto';
import { RegisterUserResDTO } from './dto/res/register-user-res.dto';
import { GetUserResDTO } from './dto/res/get-user-res.dto';
import { SearchUserResDTO } from './dto/res/search-user-res.dto';
import { UpdateUserReqDTO } from './dto/req/update-user-req.dto';
import { PatchUserReqDTO } from './dto/req/patch-user-req.dto';

import * as bcrypt from 'bcrypt';
import { SearchUserReqDTO } from './dto/req/search-user-req.dto';

@Injectable()
export class UserService {
  // Get services and repositories from DI
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  // Define methods containing business logic

  async registerUser(user: RegisterUserReqDTO): Promise<RegisterUserResDTO> {
    const userCreated = await this.userRepository.registerUser({
      ...user,
      password: await this.hashValue(user.password),
    });

    const { password, ...returnObject } = userCreated;

    return returnObject;
  }

  async getUserById(uuid: string): Promise<GetUserResDTO> {
    const userFound = await this.userRepository.getUserById(uuid);

    const { password, ...returnObject } = userFound;

    return returnObject;
  }

  async deleteUserById(uuid: string): Promise<void> {
    await this.userRepository.deleteUserById(uuid);

    return;
  }

  async modifyUserById(
    uuid: string,
    user: UpdateUserReqDTO | PatchUserReqDTO,
  ): Promise<void> {
    if (user.password) user.password = await this.hashValue(user.password);

    await this.userRepository.modifyUserById(uuid, user);

    return;
  }

  async searchUser(
    searchUserFilters: SearchUserReqDTO,
  ): Promise<SearchUserResDTO> {
    if (Object.keys(searchUserFilters).length <= 0)
      throw new BadRequestException('No filters were provided');

    const userFound = await this.userRepository.searchUser(searchUserFilters);

    if (!userFound) throw new NotFoundException();

    const { password, ...returnObject } = userFound;

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
