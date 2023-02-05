// Responsible for defining data format and relations for graphql

import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { MediaGraphqlType } from '../media/media-graphql.type';
import {
  enumGenderType,
  enumRole,
  User,
} from '../../../../../../domain/entities/user';
import { GraphqlAuthField } from 'src/infrastructure/internals/decorators/auth/graphql/graphql-auth-field.decorator';

registerEnumType(enumRole, { name: 'enumRole' });
registerEnumType(enumGenderType, { name: 'enumGenderType' });

@ObjectType()
export class UserGraphqlType implements User {
  // Auto generated fields

  @Field(() => ID)
  @GraphqlAuthField('ADMIN')
  id: string;

  @Field(() => Float) // Float to support big numbers
  @GraphqlAuthField('ADMIN', 'USER')
  createdAt: Date;

  @Field(() => Float) // Float to support big numbers
  @GraphqlAuthField('ADMIN')
  updatedAt: Date;

  // Relational fields

  @Field(() => [MediaGraphqlType])
  medias: MediaGraphqlType[];

  // Editable fields

  @Field(() => String)
  username: string;

  password: string; // cannot be a field

  @Field(() => String)
  @GraphqlAuthField('ADMIN')
  email: string;

  @Field(() => enumRole)
  @GraphqlAuthField('ADMIN')
  role: enumRole;

  @Field(() => enumGenderType)
  @GraphqlAuthField('ADMIN', 'USER')
  gender: enumGenderType;

  @Field(() => Int)
  @GraphqlAuthField('ADMIN')
  age: number;
}
