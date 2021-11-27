// Responsible for routing requests

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
import { PatchUserDTO } from './dto/patch-user.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { SearchUserDTO } from './dto/search-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import {
  IResultServiceGetUser,
  IResultServiceRegisterUser,
  IResultServiceSearchUser,
} from './interfaces/user-service-interfaces';
import { UserService } from './user.service';

@Controller('user')
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

  @Post()
  async registerUser(
    @Body() user: RegisterUserDTO,
  ): Promise<IResultServiceRegisterUser> {
    return this.userService.registerUser(user);
  }

  @Get('/:uuid')
  async getUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<IResultServiceGetUser> {
    return this.userService.getUserById(uuid);
  }

  @Delete('/:uuid')
  @HttpCode(204)
  async deleteUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<void> {
    await this.userService.deleteUserById(uuid);

    return;
  }

  @Put('/:uuid')
  @HttpCode(204)
  async updateUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() user: UpdateUserDTO,
  ): Promise<void> {
    console.log(user);
    await this.userService.modifyUserById(uuid, user);

    return;
  }

  @Patch('/:uuid')
  @HttpCode(204)
  async patchUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() user: PatchUserDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(uuid, user);

    return;
  }

  @Get()
  async searchUser(
    @Query() searchUserDTO: SearchUserDTO,
  ): Promise<IResultServiceSearchUser> {
    return this.userService.searchUser(searchUserDTO);
  }
}
