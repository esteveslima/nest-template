// Base DTO, which can be reused and extended
// May contain data transform and validation

import { Exclude, Expose, Transform, Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IUser } from 'src/modules/user/interfaces/entity/user.interface';
import { enumMediaType, IMedia } from '../../interfaces/entity/media.interface';

@Exclude()
export class MediaDTO implements IMedia {
  // Auto generated fields

  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Relational fields

  @Expose()
  user: IUser;

  // Entity fields

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  title: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(enumMediaType, {
    message: `type must be a valid enum value: ${Object.values(enumMediaType)}`,
  })
  type: enumMediaType;

  @Expose()
  @IsString()
  @Length(0, 260)
  description: string;

  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  durationSeconds: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  contentBase64: string;

  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  views: number;

  @Expose()
  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  available: boolean;
}
