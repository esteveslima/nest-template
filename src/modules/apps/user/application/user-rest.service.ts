// Responsible for containing business logic(decoupled for rest controllers)

import { Injectable } from '@nestjs/common';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { PatchUserReqDTO } from '../adapters/entrypoints/controllers/dtos/req/patch-user-req.dto';
import { RegisterUserReqDTO } from '../adapters/entrypoints/controllers/dtos/req/register-user-req.dto';
import { SearchUserReqDTO } from '../adapters/entrypoints/controllers/dtos/req/search-user-req.dto';
import { UpdateUserReqDTO } from '../adapters/entrypoints/controllers/dtos/req/update-user-req.dto';
import { GetUserResDTO } from '../adapters/entrypoints/controllers/dtos/res/get-user-res.dto';
import { RegisterUserResDTO } from '../adapters/entrypoints/controllers/dtos/res/register-user-res.dto';
import { SearchUserResDTO } from '../adapters/entrypoints/controllers/dtos/res/search-user-res.dto';
import { IUserGateway } from '../domain/repositories/user/user-gateway.interface';
import { IHashGateway } from './ports/hash/hash-gateway.interface';

@Injectable()
export class UserRestService {
  // TODO: split methods in multiple files(?)(this way it can remain a generic name 'UserRestService' and only define the methods imported from other files): https://stackoverflow.com/questions/23876782/how-do-i-split-a-typescript-class-into-multiple-files

  // Get services and repositories from DI
  constructor(
    private userGateway: IUserGateway,
    private hashGateway: IHashGateway,
  ) {}

  // Define methods containing business logic

  // TODO: public registration aways creates with role 'USER', for role 'ADMIN' must be creted by other authorized admin
  async registerUser(user: RegisterUserReqDTO): Promise<RegisterUserResDTO> {
    const hashedPassword = await this.hashGateway.hashValue({
      value: user.password,
    });

    const userCreated = await this.userGateway.registerUser({
      ...user,
      password: hashedPassword,
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

  async getUser(uuid: string): Promise<GetUserResDTO> {
    const userFound = await this.userGateway.getUser({ id: uuid });

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
  async deleteUser(uuid: string): Promise<void> {
    await this.userGateway.deleteUser({ id: uuid });

    return;
  }

  async modifyUser(
    uuid: string,
    user: UpdateUserReqDTO | PatchUserReqDTO,
  ): Promise<void> {
    if (user.password) {
      user.password = await this.hashGateway.hashValue({
        value: user.password,
      });
    }

    await this.userGateway.modifyUser({ data: user, id: uuid });

    return;
  }

  async searchUsers(
    searchUsersFilters: SearchUserReqDTO,
  ): Promise<SearchUserResDTO[]> {
    if (Object.keys(searchUsersFilters).length <= 0) {
      throw new CustomException('UserSearchInvalidFilters');
    }

    const usersFound = await this.userGateway.searchUser(searchUsersFilters);

    if (usersFound.length <= 0) {
      throw new CustomException('UserNotFound');
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
