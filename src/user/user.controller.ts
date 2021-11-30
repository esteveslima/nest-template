// Responsible for routing private requests

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetAuthUser } from '../auth/decorators/get-auth-user.decorator';
import { PatchUserDTO } from './dto/patch-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { IResultServiceGetUser } from './interfaces/service/get-user.interface';
import { UserEntity } from './user.entity';

import { UserService } from './user.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { IResultServiceRegisterUser } from './interfaces/service/register-user.interface';
import { SearchUserDTO } from './dto/search-user.dto';
import { IResultServiceSearchUser } from './interfaces/service/search-user.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('/user')
// Pipes for DTO validations
@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
// Interceptor for outputs serialization(applying decorators rules)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  // Get services and modules from DI
  constructor(private userService: UserService) {}
  //TODO: create logger interceptor(global?) with timestamps diff for services and repository
  // Define and map routes to services

  @Post()
  async registerUser(
    @Body() userObject: RegisterUserDTO,
  ): Promise<IResultServiceRegisterUser> {
    return this.userService.registerUser(userObject);
  }

  @Get()
  async searchUser(
    @Query() searchUserFilters: SearchUserDTO,
  ): Promise<IResultServiceSearchUser> {
    return this.userService.searchUser(searchUserFilters);
  }

  @Get('/current')
  @Auth('USER', 'ADMIN')
  async getCurrentUser(
    @GetAuthUser() authUser: UserEntity,
  ): Promise<IResultServiceGetUser> {
    return this.userService.getUserById(authUser.id);
  }

  @Put('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  async updateCurrentUser(
    @GetAuthUser() authUser: UserEntity,
    @Body() userObject: UpdateUserDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(authUser.id, userObject);

    return;
  }

  @Patch('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  async patchCurrentUser(
    @GetAuthUser() authUser: UserEntity,
    @Body() userObject: PatchUserDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(authUser.id, userObject);

    return;
  }

  @Get('/:uuid')
  @Auth('ADMIN')
  async getUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<IResultServiceGetUser> {
    return this.userService.getUserById(uuid);
  }

  //TODO: allow an admin role full access to all routes
  //TODO: create interceptor+decorator to verify user with admin role
  //TODO: allow basic crud operations only for an admin role
  @Delete('/:uuid')
  @HttpCode(204)
  @Auth('ADMIN')
  async deleteUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<void> {
    await this.userService.deleteUserById(uuid);

    return;
  }

  @Put('/:uuid')
  @HttpCode(204)
  @Auth('ADMIN')
  async updateUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() userObject: UpdateUserDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(uuid, userObject);

    return;
  }

  @Patch('/:uuid')
  @HttpCode(204)
  @Auth('ADMIN')
  async patchUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() userObject: PatchUserDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(uuid, userObject);

    return;
  }
}
