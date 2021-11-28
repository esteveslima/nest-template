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
import { IResultServiceGetUser } from './interfaces/user-service-interfaces';
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
}
