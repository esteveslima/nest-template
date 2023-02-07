import {
  ArgsType,
  Field,
  Float,
  ID,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { UserValidatorDTO } from 'src/adapters/entrypoints/controllers/dtos/request/user/base/user-validator.dto';
import { enumGenderType, enumRole, User } from 'src/domain/entities/user';
import { MediaGraphqlType } from '../../../types/media/media-graphql.type';

registerEnumType(enumRole, { name: 'enumRole' });
registerEnumType(enumGenderType, { name: 'enumGenderType' });

@ArgsType()
// Extending base validation DTO to reuse class-validator decorators
export class UserBaseGraphqlArgsDTO extends UserValidatorDTO implements User {
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
