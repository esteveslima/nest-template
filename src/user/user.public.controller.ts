// Responsible for routing public requests

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDTO } from './dto/register-user.dto';
import { SearchUserDTO } from './dto/search-user.dto';
import { IResultServiceRegisterUser } from './interfaces/service/register-user.interface';
import { IResultServiceSearchUser } from './interfaces/service/search-user.interface';
import { UserService } from './user.service';

@Controller('public/user')
// Pipes for DTO validations
@UsePipes(
  new ValidationPipe({
    whitelist: true,
  }),
)
// Interceptor for outputs serialization(applying decorators rules)
@UseInterceptors(ClassSerializerInterceptor)
export class UserPublicController {
  // Get services and modules from DI
  constructor(private userService: UserService) {}

  // Define and map routes to services

  @Post()
  async registerUser(
    @Body() userObject: RegisterUserDTO,
  ): Promise<IResultServiceRegisterUser> {
    return this.userService.registerUser(userObject);
  }

  @Get()
  async searchUser(
    @Query() searchUserFilters: SearchUserDTO,
  ): Promise<IResultServiceSearchUser> {
    return this.userService.searchUser(searchUserFilters);
  }
}
