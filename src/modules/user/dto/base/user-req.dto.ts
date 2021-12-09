// Base DTO, which can be reused and extended
// May contain data transformation and validation for request

import { Transform, Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IMedia } from '../../../media/interfaces/entity/media.interface';
import {
  enumGenderType,
  enumRole,
  IUser,
} from '../../interfaces/entity/user.interface';

export class UserReqDTO implements IUser {
  // Auto generated fields

  id: string;

  createdAt: Date;

  updatedAt: Date;

  // Relational fields

  medias: IMedia[];

  // Entity fields

  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(5, 180)
  email: string;

  @IsNotEmpty()
  @IsEnum(enumRole, {
    message: `role must be a valid enum value: ${Object.values(enumRole)}`,
  })
  role: enumRole;

  @IsNotEmpty()
  @IsEnum(enumGenderType, {
    message: `gender must be a valid enum value: ${Object.values(
      enumGenderType,
    )}`,
  })
  gender: enumGenderType;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  age: number;
}
