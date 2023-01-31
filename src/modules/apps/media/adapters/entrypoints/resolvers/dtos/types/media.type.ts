// Responsible for defining data format and relations for graphql

import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { GraphqlAuthField } from '../../../../../../auth/infrastructure/internals/decorators/auth/graphql/graphql-auth-field.decorator';

import { UserType } from '../../../../../../user/adapters/entrypoints/resolvers/dtos/types/user.type';
import { enumMediaType, Media } from '../../../../../domain/media.interface';

registerEnumType(enumMediaType, { name: 'enumMediaType' });

@ObjectType()
export class MediaType implements Media {
  // Auto generated fields

  @Field(() => ID)
  id: string;

  @Field(() => Float) // Float to support big numbers
  createdAt: Date;

  @Field(() => Float) // Float to support big numbers
  @GraphqlAuthField('ADMIN')
  updatedAt: Date;

  // Relational fields

  @Field(() => UserType)
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
