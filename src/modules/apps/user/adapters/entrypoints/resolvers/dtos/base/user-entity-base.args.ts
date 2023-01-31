import {
  ArgsType,
  Field,
  Float,
  ID,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { MediaType } from 'src/modules/apps/media/adapters/entrypoints/resolvers/dtos/types/media.type';
import {
  enumGenderType,
  enumRole,
  User,
} from 'src/modules/apps/user/domain/user.interface';

import { UserRestValidationDTO } from '../../../controllers/dtos/base/user-rest-validation.dto';

registerEnumType(enumRole, { name: 'enumRole' });
registerEnumType(enumGenderType, { name: 'enumGenderType' });

@ArgsType()
// Extending base validation DTO to reuse class-validator decorators
export class UserEntityBaseArgsDTO
  extends UserRestValidationDTO
  implements User
{
  // Auto generated fields

  @Field(() => ID)
  id: string;

  @Field(() => Float) // Float to support big numbers
  createdAt: Date;

  @Field(() => Float) // Float to support big numbers
  updatedAt: Date;

  // Relational fields

  @Field(() => [MediaType], { nullable: true })
  medias: MediaType[];

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
