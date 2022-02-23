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
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

import { RegisterUserReqDTO } from './dto/req/register-user-req.dto';
import { RegisterUserResDTO } from './dto/res/register-user-res.dto';
import { GetUserResDTO } from './dto/res/get-user-res.dto';
import { SearchUserReqDTO } from './dto/req/search-user-req.dto';
import { SearchUserResDTO } from './dto/res/search-user-res.dto';
import { UpdateUserReqDTO } from './dto/req/update-user-req.dto';
import { PatchUserReqDTO } from './dto/req/patch-user-req.dto';

import { Log } from '../../decorators/log.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetAuthUser } from '../auth/decorators/get-auth-user.decorator';
import { SerializeOutput } from '../../decorators/serialize-output.decorator';

@Controller('/user')
export class UserController {
  // Get services and modules from DI
  constructor(private userService: UserService) {}

  // Define and map routes to services

  @Post()
  @SerializeOutput(RegisterUserResDTO)
  async registerUser(
    @Body() userObject: RegisterUserReqDTO,
  ): Promise<RegisterUserResDTO> {
    return this.userService.registerUser(userObject);
  }

  @Get()
  @SerializeOutput(RegisterUserResDTO)
  async searchUser(
    @Query() searchUserFilters: SearchUserReqDTO,
  ): Promise<SearchUserResDTO> {
    return this.userService.searchUser(searchUserFilters);
  }

  @Get('/current')
  @Auth('USER', 'ADMIN')
  @SerializeOutput(GetUserResDTO)
  async getCurrentUser(
    @GetAuthUser() authUser: UserEntity,
  ): Promise<GetUserResDTO> {
    return this.userService.getUserById(authUser.id);
  }

  @Put('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  async updateCurrentUser(
    @GetAuthUser() authUser: UserEntity,
    @Body() userObject: UpdateUserReqDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(authUser.id, userObject);

    return;
  }

  @Patch('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  async patchCurrentUser(
    @GetAuthUser() authUser: UserEntity,
    @Body() userObject: PatchUserReqDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(authUser.id, userObject);

    return;
  }

  @Get('/:uuid')
  @Auth('ADMIN')
  @SerializeOutput(GetUserResDTO)
  async getUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<GetUserResDTO> {
    return this.userService.getUserById(uuid);
  }

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
    @Body() userObject: UpdateUserReqDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(uuid, userObject);

    return;
  }

  @Patch('/:uuid')
  @HttpCode(204)
  @Auth('ADMIN')
  async patchUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() userObject: PatchUserReqDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(uuid, userObject);

    return;
  }
}
