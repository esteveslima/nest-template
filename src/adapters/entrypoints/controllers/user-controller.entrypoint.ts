// Responsible for routing rest api requests

import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { User } from '../../../domain/entities/user';
import { Exception } from 'src/domain/entities/exception';
import { ExceptionsIndex } from 'src/adapters/exceptions/exceptions-index';
import { UserRestService } from 'src/application/services/user/user-rest.service';
import { SwaggerDoc } from 'src/infrastructure/internals/decorators/swagger-doc.decorator';
import { RegisterUserReqDTO } from './dtos/req/user/register-user-req.dto';
import { RegisterUserResDTO } from './dtos/res/user/register-user-res.dto';
import { UserAlreadyExistsException } from 'src/domain/exceptions/user/user-already-exists.exception';
import { SearchUsersReqDTO } from './dtos/req/user/search-users-req.dto';
import { SearchUsersResDTO } from './dtos/res/user/search-users-res.dto';
import { Auth } from 'src/infrastructure/internals/decorators/auth/auth.decorator';
import { GetAuthUser } from 'src/infrastructure/internals/decorators/auth/get-auth-user.decorator';
import { GetUserResDTO } from './dtos/res/user/get-user-res.dto';
import {
  UpdateUserReqBodyDTO,
  UpdateUserReqParamsDTO,
} from './dtos/req/user/update-user-req.dto';
import {
  PatchUserReqBodyDTO,
  PatchUserReqParamsDTO,
} from './dtos/req/user/patch-user-req.dto';
import { GetUserReqDTO } from './dtos/req/user/get-user-req.dto';
import { DeleteUserReqDTO } from './dtos/req/user/delete-user-req.dto';

@Controller('/rest/user')
export class UserControllerEntrypoint {
  // Get services and modules from DI
  constructor(private userService: UserRestService) {}

  // Define and map routes to services

  //TODO: create presenters for different response formats(?)
  @Post()
  @SwaggerDoc({ tag: '/user', description: '' })
  async registerUser(
    @Body() body: RegisterUserReqDTO,
  ): Promise<RegisterUserResDTO> {
    try {
      return await this.userService.registerUser(body);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserAlreadyExistsException: (e: UserAlreadyExistsException) =>
            new ConflictException(
              `Username ${e.payload?.username} or email ${e.payload?.email} already exists`,
            ),
        },
      });
    }
  }

  @Get()
  @SwaggerDoc({ tag: '/user', description: '' })
  async searchUsers(
    @Query() params: SearchUsersReqDTO,
  ): Promise<SearchUsersResDTO[]> {
    try {
      return await this.userService.searchUsers(params);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) => new NotFoundException('User not found'),
        },
      });
    }
  }

  @Get('/current')
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async getCurrentUser(@GetAuthUser() authUser: User): Promise<GetUserResDTO> {
    try {
      return await this.userService.getUser({ id: authUser.id });
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) =>
            new InternalServerErrorException(
              'An error ocurred on getting the current user data',
            ),
        },
      });
    }
  }

  @Put('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async updateCurrentUser(
    @GetAuthUser() authUser: User,
    @Body() body: UpdateUserReqBodyDTO,
  ): Promise<void> {
    try {
      return await this.userService.modifyUser({
        indexes: { id: authUser.id },
        data: body,
      });
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) =>
            new InternalServerErrorException(
              'An error ocurred on getting the current user data',
            ),
          UserUpdateFailException: (e) =>
            new BadRequestException('Update data not accepted'),
        },
      });
    }
  }

  @Patch('/current')
  @HttpCode(204)
  @Auth('USER', 'ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async patchCurrentUser(
    @GetAuthUser() authUser: User,
    @Body() body: PatchUserReqBodyDTO,
  ): Promise<void> {
    try {
      return await this.userService.modifyUser({
        indexes: { id: authUser.id },
        data: body,
      });
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) =>
            new InternalServerErrorException(
              'An error ocurred on getting the current user data',
            ),
          UserUpdateFailException: (e) =>
            new BadRequestException('Update data not accepted'),
        },
      });
    }
  }

  @Get('/:id')
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async getUser(@Param() params: GetUserReqDTO): Promise<GetUserResDTO> {
    try {
      return await this.userService.getUser(params);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) => new NotFoundException('User not found'),
        },
      });
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async deleteUser(@Param() params: DeleteUserReqDTO): Promise<void> {
    try {
      return await this.userService.deleteUser(params);
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) => new NotFoundException('User not found'),
        },
      });
    }
  }

  @Put('/:id')
  @HttpCode(204)
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async updateUser(
    @Param() params: UpdateUserReqParamsDTO,
    @Body() body: UpdateUserReqBodyDTO,
  ): Promise<void> {
    try {
      return await this.userService.modifyUser({ indexes: params, data: body });
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) => new NotFoundException('User not found'),
          UserUpdateFailException: (e) =>
            new BadRequestException('Update data not accepted'),
        },
      });
    }
  }

  @Patch('/:id')
  @HttpCode(204)
  @Auth('ADMIN')
  @SwaggerDoc({ tag: '/user', description: '', authEnabled: true })
  async patchUser(
    @Param() params: PatchUserReqParamsDTO,
    @Body() body: PatchUserReqBodyDTO,
  ): Promise<void> {
    try {
      return await this.userService.modifyUser({ indexes: params, data: body });
    } catch (exception) {
      throw Exception.mapExceptions<ExceptionsIndex, HttpException>({
        exception,
        defaultError: new InternalServerErrorException(),
        errorMap: {
          UserNotFoundException: (e) => new NotFoundException('User not found'),
          UserUpdateFailException: (e) =>
            new BadRequestException('Update data not accepted'),
        },
      });
    }
  }
}
