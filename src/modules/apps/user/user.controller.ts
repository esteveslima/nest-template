// Responsible for routing rest api requests

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

import { UserEntity } from './models/user.entity';

import { RegisterUserReqDTO } from './dtos/rest/req/register-user-req.dto';
import { SearchUserReqDTO } from './dtos/rest/req/search-user-req.dto';
import { UpdateUserReqDTO } from './dtos/rest/req/update-user-req.dto';
import { PatchUserReqDTO } from './dtos/rest/req/patch-user-req.dto';

import { Auth } from '../auth/decorators/auth.decorator';
import { SwaggerDoc } from 'src/common/decorators/swagger-doc.decorator';
import { GetAuthUserEntity } from '../auth/decorators/get-auth-user-entity.decorator';
import { UserRestService } from './services/domain/user-rest.service';

@Controller('/rest/user')
export class UserController {
  // Get services and modules from DI
  constructor(private userService: UserRestService) {}

  // Define and map routes to services

  @Post()
  @SwaggerDoc({ tag: '/user', description: '' })
  async registerUser(
    @Body() userObject: RegisterUserReqDTO,
  ): ReturnType<typeof UserRestService.prototype.registerUser> {
    return this.userService.registerUser(userObject);
  }

  @Get()
  @SwaggerDoc({ tag: '/user', description: '' })
  async searchUser(
    @Query() searchUserFilters: SearchUserReqDTO,
  ): ReturnType<typeof UserRestService.prototype.searchUsers> {
    return this.userService.searchUsers(searchUserFilters);
  }

  @Get('/current')
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async getCurrentUser(
    @GetAuthUserEntity() authUser: UserEntity,
  ): ReturnType<typeof UserRestService.prototype.getUserById> {
    return this.userService.getUserById(authUser.id);
  }

  @Put('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async updateCurrentUser(
    @GetAuthUserEntity() authUser: UserEntity,
    @Body() userObject: UpdateUserReqDTO,
  ): ReturnType<typeof UserRestService.prototype.modifyUserById> {
    await this.userService.modifyUserById(authUser.id, userObject);

    return;
  }

  @Patch('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async patchCurrentUser(
    @GetAuthUserEntity() authUser: UserEntity,
    @Body() userObject: PatchUserReqDTO,
  ): ReturnType<typeof UserRestService.prototype.modifyUserById> {
    await this.userService.modifyUserById(authUser.id, userObject);

    return;
  }

  @Get('/:uuid')
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async getUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): ReturnType<typeof UserRestService.prototype.getUserById> {
    return this.userService.getUserById(uuid);
  }

  @Delete('/:uuid')
  @HttpCode(204)
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async deleteUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): ReturnType<typeof UserRestService.prototype.deleteUserById> {
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
  ): ReturnType<typeof UserRestService.prototype.modifyUserById> {
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
  ): ReturnType<typeof UserRestService.prototype.modifyUserById> {
    await this.userService.modifyUserById(uuid, userObject);

    return;
  }
}
