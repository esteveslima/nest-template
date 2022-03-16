// Responsible for defining data format and relations for graphql

import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { GraphqlAuthField } from 'src/modules/apps/auth/internals/decorators/graphql/graphql-auth-field.decorator';

import { MediaType } from '../../media/models/media.type';
import {
  enumGenderType,
  enumRole,
  IUser,
} from '../interfaces/models/entities/user-entity.interface';

registerEnumType(enumRole, { name: 'enumRole' });
registerEnumType(enumGenderType, { name: 'enumGenderType' });

@ObjectType()
export class UserType implements IUser {
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
