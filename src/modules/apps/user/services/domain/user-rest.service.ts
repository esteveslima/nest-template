// Responsible for containing business logic(decoupled for rest controllers)

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashService } from '../adapters/clients/hash.service';
import { RegisterUserReqDTO } from '../../dtos/rest/req/register-user-req.dto';
import { UpdateUserReqDTO } from '../../dtos/rest/req/update-user-req.dto';
import { PatchUserReqDTO } from '../../dtos/rest/req/patch-user-req.dto';
import { SearchUserReqDTO } from '../../dtos/rest/req/search-user-req.dto';
import { RegisterUserResDTO } from '../../dtos/rest/res/register-user-res.dto';
import { GetUserResDTO } from '../../dtos/rest/res/get-user-res.dto';
import { SearchUserResDTO } from '../../dtos/rest/res/search-user-res.dto';
import { UserRepository } from '../adapters/database/repositories/user.repository';

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
    await this.userRepository.deleteUserById(uuid);

    return;
  }

  async modifyUserById(
    uuid: string,
    user: UpdateUserReqDTO | PatchUserReqDTO,
  ): Promise<void> {
    if (user.password) {
      user.password = await this.hashService.hashValue(user.password);
    }

    await this.userRepository.modifyUserById(uuid, user);

    return;
  }

  async searchUsers(
    searchUsersFilters: SearchUserReqDTO,
  ): Promise<SearchUserResDTO[]> {
    if (Object.keys(searchUsersFilters).length <= 0) {
      throw new BadRequestException('No filters were provided');
    }

    const usersFound = await this.userRepository.searchUser(searchUsersFilters);

    if (usersFound.length <= 0) {
      throw new NotFoundException(); // TODO: ideally it shouldn't be a http exception to provide proper isolation and separation of concerns, this was made due convenience to not having a specialized exception filter to map into http errors the custom uncaught thrown errors that bubbles up the call stack
    }

    return usersFound.map((user) => ({
      email: user.email,
      id: user.id,
      medias: user.medias,
      role: user.role,
      username: user.username,
    }));
  }
}
