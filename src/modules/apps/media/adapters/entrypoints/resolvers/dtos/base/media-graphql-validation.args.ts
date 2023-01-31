import { ArgsType, Field, Float, ID, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator';
import {
  enumMediaType,
  Media,
} from 'src/modules/apps/media/domain/media.interface';
import { UserType } from 'src/modules/apps/user/adapters/entrypoints/resolvers/dtos/types/user.type';

@ArgsType()
// Extending base validation DTO to reuse class-validator decorators
export class MediaGraphqlValidationArgs implements Media {
  // Auto generated fields

  @Field(() => ID)
  id: string;

  @Field(() => Float) // Float to support big numbers
  createdAt: Date;

  @Field(() => Float) // Float to support big numbers
  updatedAt: Date;

  // Relational fields

  @Field(() => UserType, { nullable: true })
  user: UserType;

  // Editable fields

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  title: string;

  @Field(() => enumMediaType)
  @IsNotEmpty()
  @IsEnum(enumMediaType, {
    message: `type must be a valid enum value: ${Object.values(enumMediaType)}`,
  })
  type: enumMediaType;

  @Field(() => String)
  @IsString()
  @Length(0, 260)
  description: string;

  @Field(() => Int)
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  durationSeconds: number;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  contentBase64: string;

  @Field(() => Int)
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  views: number;

  @Field(() => Boolean)
  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  available: boolean;
}