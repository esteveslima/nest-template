// Responsible for routing rest api requests

import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { UserEntity } from '../../gateways/databases/entities/user.entity';

import { PatchUserReqDTO } from './dtos/req/patch-user-req.dto';
import { SwaggerDoc } from 'src/common/internals/decorators/swagger-doc.decorator';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { Auth } from '../../../../auth/infrastructure/internals/decorators/auth/auth.decorator';
import { GetAuthUserEntity } from '../../../../auth/infrastructure/internals/decorators/auth/get-auth-user-entity.decorator';
import { UserRestService } from '../../../application/user-rest.service';
import { RegisterUserReqDTO } from './dtos/req/register-user-req.dto';
import { SearchUserReqDTO } from './dtos/req/search-user-req.dto';
import { UpdateUserReqDTO } from './dtos/req/update-user-req.dto';

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
    try {
      return await this.userService.registerUser(userObject);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserAlreadyExists: (customException) =>
          new ConflictException('User already exists'),
      });
    }
  }

  @Get()
  @SwaggerDoc({ tag: '/user', description: '' })
  async searchUser(
    @Query() searchUserFilters: SearchUserReqDTO,
  ): ReturnType<typeof UserRestService.prototype.searchUsers> {
    try {
      return await this.userService.searchUsers(searchUserFilters);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: (customException) =>
          new NotFoundException('User not found'),
      });
    }
  }

  @Get('/current')
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async getCurrentUser(
    @GetAuthUserEntity() authUser: UserEntity,
  ): ReturnType<typeof UserRestService.prototype.getUserById> {
    try {
      return await this.userService.getUserById(authUser.id);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: (customException) =>
          new InternalServerErrorException(
            'An error ocurred on getting the current user data',
          ),
      });
    }
  }

  @Put('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async updateCurrentUser(
    @GetAuthUserEntity() authUser: UserEntity,
    @Body() userObject: UpdateUserReqDTO,
  ): ReturnType<typeof UserRestService.prototype.modifyUserById> {
    try {
      return await this.userService.modifyUserById(authUser.id, userObject);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: (customException) =>
          new InternalServerErrorException(
            'An error ocurred on getting the current user data',
          ),
        UserUpdateFail: (customException) =>
          new BadRequestException('Update data not accepted'),
      });
    }
  }

  @Patch('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async patchCurrentUser(
    @GetAuthUserEntity() authUser: UserEntity,
    @Body() userObject: PatchUserReqDTO,
  ): ReturnType<typeof UserRestService.prototype.modifyUserById> {
    try {
      return await this.userService.modifyUserById(authUser.id, userObject);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: (customException) =>
          new InternalServerErrorException(
            'An error ocurred on getting the current user data',
          ),
        UserUpdateFail: (customException) =>
          new BadRequestException('Update data not accepted'),
      });
    }
  }

  @Get('/:uuid')
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async getUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): ReturnType<typeof UserRestService.prototype.getUserById> {
    try {
      return await this.userService.getUserById(uuid);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: (customException) =>
          new NotFoundException('User not found'),
      });
    }
  }

  @Delete('/:uuid')
  @HttpCode(204)
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async deleteUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): ReturnType<typeof UserRestService.prototype.deleteUserById> {
    try {
      return await this.userService.deleteUserById(uuid);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: (customException) =>
          new NotFoundException('User not found'),
      });
    }
  }

  @Put('/:uuid')
  @HttpCode(204)
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async updateUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() userObject: UpdateUserReqDTO,
  ): ReturnType<typeof UserRestService.prototype.modifyUserById> {
    try {
      return await this.userService.modifyUserById(uuid, userObject);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: (customException) =>
          new NotFoundException('User not found'),
        UserUpdateFail: (customException) =>
          new BadRequestException('Update data not accepted'),
      });
    }
  }

  @Patch('/:uuid')
  @HttpCode(204)
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async patchUserById(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() userObject: PatchUserReqDTO,
  ): ReturnType<typeof UserRestService.prototype.modifyUserById> {
    try {
      return await this.userService.modifyUserById(uuid, userObject);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserNotFound: (customException) =>
          new NotFoundException('User not found'),
        UserUpdateFail: (customException) =>
          new BadRequestException('Update data not accepted'),
      });
    }
  }
}
