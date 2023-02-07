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
import { RegisterUserRestRequestDTO } from './dtos/request/user/register-user-rest-request.dto';
import { RegisterUserRestResponseDTO } from './dtos/response/user/register-user-rest-response.dto';
import { UserAlreadyExistsException } from 'src/domain/exceptions/user/user-already-exists.exception';
import { SearchUsersRestRequestDTO } from './dtos/request/user/search-users-rest-request.dto';
import { SearchUsersRestResponseDTO } from './dtos/response/user/search-users-rest-response.dto';
import { Auth } from 'src/infrastructure/internals/decorators/auth/auth.decorator';
import { GetAuthUser } from 'src/infrastructure/internals/decorators/auth/get-auth-user.decorator';
import { GetUserRestResponseDTO } from './dtos/response/user/get-user-rest-response.dto';
import {
  UpdateUserRestRequestBodyDTO,
  UpdateUserRestRequestParamsDTO,
} from './dtos/request/user/update-user-rest-request.dto';
import {
  PatchUserRestRequestBodyDTO,
  PatchUserRestRequestParamsDTO,
} from './dtos/request/user/patch-user-rest-request.dto';
import { GetUserRestRequestDTO } from './dtos/request/user/get-user-rest-request.dto';
import { DeleteUserRestRequestDTO } from './dtos/request/user/delete-user-rest-request.dto';

@Controller('/rest/user')
export class UserControllerEntrypoint {
  // Get services and modules from DI
  constructor(private userService: UserRestService) {}

  // Define and map routes to services

  // TODO: create presenters for different response formats(?)
  // TODO: move error mapping to those presenters(?)
  @Post()
  @SwaggerDoc({ tag: '/user', description: '' })
  async registerUser(
    @Body() body: RegisterUserRestRequestDTO,
  ): Promise<RegisterUserRestResponseDTO> {
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
    @Query() params: SearchUsersRestRequestDTO,
  ): Promise<SearchUsersRestResponseDTO[]> {
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
  async getCurrentUser(
    @GetAuthUser() authUser: User,
  ): Promise<GetUserRestResponseDTO> {
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
    @Body() body: UpdateUserRestRequestBodyDTO,
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
    @Body() body: PatchUserRestRequestBodyDTO,
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
  async getUser(
    @Param() params: GetUserRestRequestDTO,
  ): Promise<GetUserRestResponseDTO> {
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
  async deleteUser(@Param() params: DeleteUserRestRequestDTO): Promise<void> {
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
    @Param() params: UpdateUserRestRequestParamsDTO,
    @Body() body: UpdateUserRestRequestBodyDTO,
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
    @Param() params: PatchUserRestRequestParamsDTO,
    @Body() body: PatchUserRestRequestBodyDTO,
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
