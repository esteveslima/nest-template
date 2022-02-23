// Responsible for containing business logic

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

import { RegisterUserReqDTO } from './dto/req/register-user-req.dto';
import { RegisterUserResDTO } from './dto/res/register-user-res.dto';
import { GetUserResDTO } from './dto/res/get-user-res.dto';
import { UpdateUserReqDTO } from './dto/req/update-user-req.dto';
import { PatchUserReqDTO } from './dto/req/patch-user-req.dto';
import { SearchUserReqDTO } from './dto/req/search-user-req.dto';
import { SearchUserResDTO } from './dto/res/search-user-res.dto';

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

    return {
      age: userCreated.age,
      email: userCreated.email,
      gender: userCreated.gender,
      id: userCreated.id,
      medias: userCreated.medias,
      role: userCreated.role,
      username: userCreated.username,
    };
  }

  async getUserById(uuid: string): Promise<GetUserResDTO> {
    const userFound = await this.userRepository.getUserById(uuid);
    if (!userFound) throw new NotFoundException();

    return {
      age: userFound.age,
      createdAt: userFound.createdAt,
      email: userFound.email,
      gender: userFound.gender,
      id: userFound.id,
      medias: userFound.medias,
      role: userFound.role,
      username: userFound.username,
    };
  }

  async deleteUserById(uuid: string): Promise<void> {
    const isDeleted = await this.userRepository.deleteUserById(uuid);
    if (!isDeleted) throw new NotFoundException();

    return;
  }

  async modifyUserById(
    uuid: string,
    user: UpdateUserReqDTO | PatchUserReqDTO,
  ): Promise<void> {
    if (user.password) user.password = await this.hashValue(user.password);

    const isModified = await this.userRepository.modifyUserById(uuid, user);
    if (!isModified) throw new NotFoundException();

    return;
  }

  async searchUser(
    searchUserFilters: SearchUserReqDTO,
  ): Promise<SearchUserResDTO> {
    if (Object.keys(searchUserFilters).length <= 0)
      throw new BadRequestException('No filters were provided');

    const userFound = await this.userRepository.searchUser(searchUserFilters);
    if (!userFound) throw new NotFoundException();

    return {
      email: userFound.email,
      id: userFound.id,
      medias: userFound.medias,
      role: userFound.role,
      username: userFound.username,
    };
  }

  async verifyUserPassword(
    username: string,
    password: string,
  ): Promise<boolean> {
    if (!username || !password) return false;

    const userFound = await this.userRepository.searchUser({ username });
    if (!userFound) return false;

    const userHashPassword = userFound.password;
    const isValidPassword = await this.compareHash(password, userHashPassword);

    return isValidPassword;
  }

  private async hashValue(value: string): Promise<string> {
    if (!value) return undefined;
    return bcrypt.hash(value, 10);
  }
  private async compareHash(value: string, hash: string): Promise<boolean> {
    if (!value || !hash) return false;
    return bcrypt.compare(value, hash);
  }
}
