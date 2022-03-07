// Helper methods decoupled to be used only internally and not exposed to users

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { SearchUserReqDTO } from './dto/req/search-user-req.dto';
import { UserEntity } from './user.entity';
import { HashService } from './hash.service';

@Injectable()
export class UserInternalService {
  // Get services and repositories from DI
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
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
