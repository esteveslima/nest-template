// Helper methods decoupled to be used only internally and not exposed to users

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SearchUserReqDTO } from '../../dtos/rest/req/search-user-req.dto';
import { UserEntity } from '../../models/user.entity';
import { UserRepository } from '../adapters/database/repositories/user.repository';
import { HashService } from '../adapters/clients/hash.service';

@Injectable()
export class UserInternalService {
  // Get services and repositories from DI
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
  ) {}

  // Define methods containing business logic

  async searchUserEntity(
    searchUserFilters: SearchUserReqDTO,
  ): Promise<UserEntity> {
    if (Object.keys(searchUserFilters).length <= 0)
      throw new BadRequestException('No filters were provided');

    const usersFound = await this.userRepository.searchUser(searchUserFilters);
    const userFound = usersFound[0];
    if (!userFound) throw new NotFoundException();

    return userFound;
  }

  async verifyUserPassword(
    username: string,
    password: string,
  ): Promise<boolean> {
    if (!username || !password) return false;

    const usersFound = await this.userRepository.searchUser({ username });
    const userFound = usersFound[0];
    if (!userFound) return false;

    const userHashPassword = userFound.password;
    const isValidPassword = await this.hashService.compareHash(
      password,
      userHashPassword,
    );

    return isValidPassword;
  }
}
