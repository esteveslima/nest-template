// Helper methods decoupled to be used only internally and not exposed to users

import { Injectable } from '@nestjs/common';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { SearchUserReqDTO } from '../adapters/entrypoints/controllers/dtos/req/search-user-req.dto';
import { IHashGateway } from './interfaces/ports/hash/hash-gateway.interface';
import { User } from '../domain/entities/user';
import { IUserGateway } from '../domain/repositories/user/user-gateway.interface';

@Injectable()
export class UserInternalService {
  // Get services and repositories from DI
  constructor(
    private userGateway: IUserGateway,
    private hashGateway: IHashGateway,
  ) {}

  // Define methods containing business logic

  async searchUser(searchUserFilters: SearchUserReqDTO): Promise<User> {
    if (Object.keys(searchUserFilters).length <= 0) {
      throw new CustomException('UserSearchInvalidFilters');
    }

    const usersFound = await this.userGateway.searchUser(searchUserFilters);
    const userFound = usersFound[0];
    if (!userFound) throw new CustomException('UserNotFound');

    return userFound;
  }

  async verifyUserPassword(
    username: string,
    password: string,
  ): Promise<boolean> {
    if (!username || !password) return false;

    const usersFound = await this.userGateway.searchUser({ username });
    const userFound = usersFound[0];
    if (!userFound) return false;

    const userHashPassword = userFound.password;
    const isValidPassword = await this.hashGateway.compareHash({
      hash: userHashPassword,
      value: password,
    });

    return isValidPassword;
  }
}
