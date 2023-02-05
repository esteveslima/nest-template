import {
  ArgsType,
  Field,
  Float,
  ID,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { MediaGraphqlType } from 'src/modules/apps/media/adapters/entrypoints/resolvers/dtos/types/media-graphql.type';
import {
  enumGenderType,
  enumRole,
  User,
} from 'src/modules/apps/user/domain/entities/user';

import { UserValidatorDTO } from '../../../../controllers/dtos/req/base/user-validator.dto';

registerEnumType(enumRole, { name: 'enumRole' });
registerEnumType(enumGenderType, { name: 'enumGenderType' });

@ArgsType()
// Extending base validation DTO to reuse class-validator decorators
export class UserBaseArgsDTO extends UserValidatorDTO implements User {
  // Auto generated fields

  @Field(() => ID)
  id: string;

  @Field(() => Float) // Float to support big numbers
  createdAt: Date;

  @Field(() => Float) // Float to support big numbers
  updatedAt: Date;

  // Relational fields

  @Field(() => [MediaGraphqlType], { nullable: true })
  medias: MediaGraphqlType[];

  // Editable fields

  @Field(() => String)
  username: string;

  password: string; // cannot be a field

  @Field(() => String)
  email: string;

  @Field(() => enumRole)
  role: enumRole;

  @Field(() => enumGenderType)
  gender: enumGenderType;

  @Field(() => Int)
  age: number;
}
