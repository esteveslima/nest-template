import { ArgsType, Field, Float, ID, Int } from '@nestjs/graphql';
import {
  enumMediaType,
  IMedia,
} from 'src/modules/apps/media/interfaces/models/entities/media.interface';
import { UserType } from 'src/modules/apps/user/models/user.type';
import { MediaEntityValidateDTO } from '../../../base/media-entity-validate.dto';

@ArgsType()
// Extending base validation DTO to reuse class-validator decorators
export class MediaEntityBaseArgs
  extends MediaEntityValidateDTO
  implements IMedia
{
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
  title: string;

  @Field(() => enumMediaType)
  type: enumMediaType;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  durationSeconds: number;

  @Field(() => String)
  contentBase64: string;

  @Field(() => Int)
  views: number;

  @Field(() => Boolean)
  available: boolean;
}
