// Encapsulating data required for opertation in queries
// Extends base args which already contains validations
// Similar to DTOs

import {
  ArgsType,
  Field,
  Float,
  Int,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { IsOptional, Max, Min } from 'class-validator';
import { IMediaGraphqlServiceSearchMediasParams } from 'src/modules/apps/media/application/interfaces/services/media-graphql/methods/search-medias.interface';
import { MediaBaseArgs } from './base/media-base.args';

@ArgsType()
export class SearchMediasArgsDTO
  extends PartialType(
    PickType(MediaBaseArgs, [
      'title',
      'type',
      'description',
      'durationSeconds',
      'views',
      'available',
    ] as const),
  )
  implements IMediaGraphqlServiceSearchMediasParams
{
  @Field(() => Float, { nullable: true })
  @IsOptional() // cannot be from @nest/swagger
  createdAt?: number; // Input modified to accept timestamps

  @Field(() => String, { nullable: true })
  @IsOptional()
  username?: string; // Input modified to accept user username

  @Field(() => Int, { nullable: true, defaultValue: 5 })
  @IsOptional()
  @Min(1)
  @Max(5)
  take: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @Min(0)
  @Max(5)
  skip: number;
}
