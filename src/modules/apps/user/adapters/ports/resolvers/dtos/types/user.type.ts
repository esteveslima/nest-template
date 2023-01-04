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

import { MediaType } from '../../../../../../media/adapters/ports/resolvers/dtos/types/media.type';
import {
  enumGenderType,
  enumRole,
  User,
} from '../../../../../domain/user.interface';

registerEnumType(enumRole, { name: 'enumRole' });
registerEnumType(enumGenderType, { name: 'enumGenderType' });

@ObjectType()
export class UserType implements User {
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

  @Field(() => [MediaType])
  medias: MediaType[];

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
