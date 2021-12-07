// Base DTO, which can be reused and extended
// May contain data transform and validation

import { Exclude, Expose, Transform, Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IMedia } from 'src/modules/media/interfaces/entity/media.interface';
import {
  enumGenderType,
  enumRole,
  IUser,
} from '../../interfaces/entity/user.interface';

@Exclude()
export class UserDTO implements IUser {
  // Auto generated fields

  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Relational fields

  @Expose()
  medias: IMedia[];

  // Entity fields

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  password: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(5, 180)
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(enumRole, {
    message: `role must be a valid enum value: ${Object.values(enumRole)}`,
  })
  role: enumRole;

  @Expose()
  @IsNotEmpty()
  @IsEnum(enumGenderType, {
    message: `gender must be a valid enum value: ${Object.values(
      enumGenderType,
    )}`,
  })
  gender: enumGenderType;

  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  age: number;
}
