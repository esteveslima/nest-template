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
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PatchUserDTO } from './dto/patch-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { IResultServiceGetUser } from './interfaces/service/get-user.interface';

import { UserService } from './user.service';

@Controller('private/user')
// Pipes for DTO validations
@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
// Interceptor for outputs serialization(applying decorators rules)
@UseInterceptors(ClassSerializerInterceptor)
// Guards with to protect routes from unhauthorized access
@UseGuards(AuthGuard())
export class UserPrivateController {
  // Get services and modules from DI
  constructor(private userService: UserService) {}

  // Define and map routes to services

  @Get('/:uuid')
  async getUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<IResultServiceGetUser> {
    return this.userService.getUserById(uuid);
  }

  //TODO: methods to operate current user

  //TODO: allow an admin role full access to all routes

  //TODO: allow basic crud operations only for an admin role
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
    @Body() userObject: UpdateUserDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(uuid, userObject);

    return;
  }

  @Patch('/:uuid')
  @HttpCode(204)
  async patchUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() userObject: PatchUserDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(uuid, userObject);

    return;
  }

  @Put('/current')
  @HttpCode(204)
  async updateCurrentUser(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() userObject: UpdateUserDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(uuid, userObject);

    return;
  }

  @Patch('/:uuid')
  @HttpCode(204)
  async patchCurrentUser(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() userObject: PatchUserDTO,
  ): Promise<void> {
    await this.userService.modifyUserById(uuid, userObject);

    return;
  }
}
