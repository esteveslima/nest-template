import {
  ArgsType,
  Field,
  Float,
  ID,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { MediaType } from 'src/modules/apps/media/models/media.type';
import {
  enumGenderType,
  enumRole,
  IUser,
} from 'src/modules/apps/user/interfaces/models/entities/user-entity.interface';
import { UserEntityValidateDTO } from '../../../base/user-entity-validate.dto';

registerEnumType(enumRole, { name: 'enumRole' });
registerEnumType(enumGenderType, { name: 'enumGenderType' });

@ArgsType()
// Extending base validation DTO to reuse class-validator decorators
export class UserEntityBaseArgsDTO
  extends UserEntityValidateDTO
  implements IUser
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
