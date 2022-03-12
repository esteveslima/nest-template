// Responsible for containing business logic(decoupled for rest controllers)

import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { HashService } from '../utils/hash.service';
import { RegisterUserReqDTO } from '../../dtos/rest/req/register-user-req.dto';
import { UpdateUserReqDTO } from '../../dtos/rest/req/update-user-req.dto';
import { PatchUserReqDTO } from '../../dtos/rest/req/patch-user-req.dto';
import { SearchUserReqDTO } from '../../dtos/rest/req/search-user-req.dto';
import { RegisterUserResDTO } from '../../dtos/rest/res/register-user-res.dto';
import { GetUserResDTO } from '../../dtos/rest/res/get-user-res.dto';
import { SearchUserResDTO } from '../../dtos/rest/res/search-user-res.dto';
import { UserRepository } from '../database/repositories/user.repository';

@Injectable()
export class UserRestService {
  // TODO: split methods in multiple files(?)(this way it can remain a generic name 'UserRestService' and only define the methods imported from other files): https://stackoverflow.com/questions/23876782/how-do-i-split-a-typescript-class-into-multiple-files

  // Get services and repositories from DI
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
  ) {}

  // Define methods containing business logic

  // TODO: public registration aways creates with role 'USER', for role 'ADMIN' must be creted by other authorized admin
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

  //TODO: forbid delete id from current user
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

  async searchUsers(
    searchUserFilters: SearchUserReqDTO,
  ): Promise<SearchUserResDTO[]> {
    if (Object.keys(searchUserFilters).length <= 0)
      throw new BadRequestException('No filters were provided');

    const usersFound = await this.userRepository.searchUser(searchUserFilters);
    if (usersFound.length <= 0) throw new NotFoundException();

    return usersFound.map((user) => ({
      email: user.email,
      id: user.id,
      medias: user.medias,
      role: user.role,
      username: user.username,
    }));
  }
}
