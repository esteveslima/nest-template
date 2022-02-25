// Responsible for routing private requests

import {
  Body,
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
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

import { RegisterUserReqDTO } from './dto/req/register-user-req.dto';
import { SearchUserReqDTO } from './dto/req/search-user-req.dto';
import { UpdateUserReqDTO } from './dto/req/update-user-req.dto';
import { PatchUserReqDTO } from './dto/req/patch-user-req.dto';

import { Auth } from '../auth/decorators/auth.decorator';
import { GetAuthUser } from '../auth/decorators/get-auth-user.decorator';
import { SwaggerDoc } from 'src/common/decorators/swagger-doc.decorator';

@Controller('/rest/user')
export class UserController {
  // Get services and modules from DI
  constructor(private userService: UserService) {}

  // Define and map routes to services

  @Post()
  @SwaggerDoc({ tag: '/user', description: '' })
  async registerUser(
    @Body() userObject: RegisterUserReqDTO,
  ): ReturnType<typeof UserService.prototype.registerUser> {
    return this.userService.registerUser(userObject);
  }

  @Get()
  @SwaggerDoc({ tag: '/user', description: '' })
  async searchUser(
    @Query() searchUserFilters: SearchUserReqDTO,
  ): ReturnType<typeof UserService.prototype.searchUser> {
    return this.userService.searchUser(searchUserFilters);
  }

  @Get('/current')
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async getCurrentUser(
    @GetAuthUser() authUser: UserEntity,
  ): ReturnType<typeof UserService.prototype.getUserById> {
    return this.userService.getUserById(authUser.id);
  }

  @Put('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async updateCurrentUser(
    @GetAuthUser() authUser: UserEntity,
    @Body() userObject: UpdateUserReqDTO,
  ): ReturnType<typeof UserService.prototype.modifyUserById> {
    await this.userService.modifyUserById(authUser.id, userObject);

    return;
  }

  @Patch('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async patchCurrentUser(
    @GetAuthUser() authUser: UserEntity,
    @Body() userObject: PatchUserReqDTO,
  ): ReturnType<typeof UserService.prototype.modifyUserById> {
    await this.userService.modifyUserById(authUser.id, userObject);

    return;
  }

  @Get('/:uuid')
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async getUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): ReturnType<typeof UserService.prototype.getUserById> {
    return this.userService.getUserById(uuid);
  }

  @Delete('/:uuid')
  @HttpCode(204)
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async deleteUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): ReturnType<typeof UserService.prototype.deleteUserById> {
    await this.userService.deleteUserById(uuid);

    return;
  }

  @Put('/:uuid')
  @HttpCode(204)
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async updateUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() userObject: UpdateUserReqDTO,
  ): ReturnType<typeof UserService.prototype.modifyUserById> {
    await this.userService.modifyUserById(uuid, userObject);

    return;
  }

  @Patch('/:uuid')
  @HttpCode(204)
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async patchUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() userObject: PatchUserReqDTO,
  ): ReturnType<typeof UserService.prototype.modifyUserById> {
    await this.userService.modifyUserById(uuid, userObject);

    return;
  }
}
