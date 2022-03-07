// Responsible for containing business logic

import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { HashService } from './hash.service';

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
    private hashService: HashService,
  ) {}

  // Define methods containing business logic

  async registerUser(user: RegisterUserReqDTO): Promise<RegisterUserResDTO> {
    const userCreated = await this.userRepository.registerUser({
      ...user,
      password: await this.hashService.hashValue(user.password),
    });

    if (!userCreated) {
      throw new NotAcceptableException('Registration data not accepted');
    }

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
    if (user.password)
      user.password = await this.hashService.hashValue(user.password);

    const modifyResult = await this.userRepository.modifyUserById(uuid, user);
    if (modifyResult === undefined) {
      throw new NotAcceptableException('Update data not accepted');
    }
    if (modifyResult === false) {
      throw new NotFoundException();
    }

    return;
  }

  async searchUser(
    searchUserFilters: SearchUserReqDTO,
  ): Promise<SearchUserResDTO> {
    if (Object.keys(searchUserFilters).length <= 0)
      throw new BadRequestException('No filters were provided');

    const usersFound = await this.userRepository.searchUser(searchUserFilters);
    const userFound = usersFound[0];
    if (!userFound) throw new NotFoundException();

    return {
      email: userFound.email,
      id: userFound.id,
      medias: userFound.medias,
      role: userFound.role,
      username: userFound.username,
    };
  }
}
