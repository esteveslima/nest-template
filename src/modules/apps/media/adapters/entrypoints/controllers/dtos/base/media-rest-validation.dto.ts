// Base DTO, which can be reused and extended
// May contain data transform and validation

import { Transform, Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import {
  enumMediaType,
  Media,
} from 'src/modules/apps/media/domain/media.interface';
import { User } from 'src/modules/apps/user/domain/user.interface';

export class MediaRestValidationDTO implements Media {
  // Auto generated fields

  @IsUUID()
  id: string;

  createdAt: Date;

  updatedAt: Date;

  // Relational fields

  user: User;

  // Entity fields

  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  title: string;

  @IsNotEmpty()
  @IsEnum(enumMediaType, {
    message: `type must be a valid enum value: ${Object.values(enumMediaType)}`,
  })
  type: enumMediaType;

  @IsString()
  @Length(0, 260)
  description: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  durationSeconds: number;

  @IsNotEmpty()
  @IsString()
  contentBase64: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  views: number;

  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  available: boolean;
}
