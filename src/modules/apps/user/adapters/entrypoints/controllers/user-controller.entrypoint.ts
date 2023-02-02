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
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  PatchUserReqBodyDTO,
  PatchUserReqParamsDTO,
} from './dtos/req/patch-user-req.dto';
import { SwaggerDoc } from 'src/common/internals/decorators/swagger-doc.decorator';
import { CustomException } from 'src/common/internals/enhancers/filters/exceptions/custom-exception';
import { Auth } from '../../../../auth/infrastructure/internals/decorators/auth/auth.decorator';
import { GetAuthUser } from '../../../../auth/infrastructure/internals/decorators/auth/get-auth-user.decorator';
import { UserRestService } from '../../../application/user-rest.service';
import { RegisterUserReqDTO } from './dtos/req/register-user-req.dto';
import { SearchUsersReqDTO } from './dtos/req/search-users-req.dto';
import {
  UpdateUserReqBodyDTO,
  UpdateUserReqParamsDTO,
} from './dtos/req/update-user-req.dto';
import { User } from '../../../domain/entities/user';
import { GetUserReqDTO } from './dtos/req/get-user-req.dto';
import { DeleteUserReqDTO } from './dtos/req/delete-user-req.dto';
import { RegisterUserResDTO } from './dtos/res/register-user-res.dto';
import { SearchUsersResDTO } from './dtos/res/search-users-res.dto';
import { GetUserResDTO } from './dtos/res/get-user-res.dto';

@Controller('/rest/user')
export class UserControllerEntrypoint {
  // Get services and modules from DI
  constructor(private userService: UserRestService) {}

  // Define and map routes to services

  @Post()
  @SwaggerDoc({ tag: '/user', description: '' })
  async registerUser(
    @Body() body: RegisterUserReqDTO,
  ): Promise<RegisterUserResDTO> {
    try {
      return await this.userService.registerUser(body);
    } catch (e) {
      throw CustomException.mapHttpException(e, {
        UserAlreadyExists: (customException) =>
          new ConflictException('User already exists'),
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
  async getCurrentUser(@GetAuthUser() authUser: User): Promise<GetUserResDTO> {
    try {
      return await this.userService.getUser({ id: authUser.id });
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
    @GetAuthUser() authUser: User,
    @Body() body: UpdateUserReqBodyDTO,
  ): Promise<void> {
    try {
      return await this.userService.modifyUser({
        indexes: { id: authUser.id },
        data: body,
      });
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
    @GetAuthUser() authUser: User,
    @Body() body: PatchUserReqBodyDTO,
  ): Promise<void> {
    try {
      return await this.userService.modifyUser({
        indexes: { id: authUser.id },
        data: body,
      });
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
  async getUser(@Param() params: GetUserReqDTO): Promise<GetUserResDTO> {
    try {
      return await this.userService.getUser(params);
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
  async deleteUser(@Param() params: DeleteUserReqDTO): Promise<void> {
    try {
      return await this.userService.deleteUser(params);
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
  async updateUser(
    @Param() params: UpdateUserReqParamsDTO,
    @Body() body: UpdateUserReqBodyDTO,
  ): Promise<void> {
    try {
      return await this.userService.modifyUser({ indexes: params, data: body });
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
  async patchUser(
    @Param() params: PatchUserReqParamsDTO,
    @Body() body: PatchUserReqBodyDTO,
  ): Promise<void> {
    try {
      return await this.userService.modifyUser({ indexes: params, data: body });
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
