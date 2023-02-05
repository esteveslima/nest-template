// Base DTO, which can be reused and extended
// May contain data transformation and validation for request

import { Transform, Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { Media } from '../../../../../../../media/domain/entities/media';
import {
  enumGenderType,
  enumRole,
  User,
} from '../../../../../../domain/entities/user';

export class UserValidatorDTO implements User {
  // Auto generated fields

  @IsString()
  @IsUUID()
  id: string;

  createdAt: Date;

  updatedAt: Date;

  // Relational fields

  medias: Media[];

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
