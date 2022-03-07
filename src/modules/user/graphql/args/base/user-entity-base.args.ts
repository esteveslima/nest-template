import {
  ArgsType,
  Field,
  Float,
  ID,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { MediaType } from 'src/modules/media/graphql/media.type';
import { UserEntityValidateDTO } from 'src/modules/user/dto/base/user-entity-validate.dto';
import {
  enumGenderType,
  enumRole,
  IUser,
} from 'src/modules/user/interfaces/entity/user.interface';

registerEnumType(enumRole, { name: 'enumRole' });
registerEnumType(enumGenderType, { name: 'enumGenderType' });

@ArgsType()
export class UserEntityBaseArgs extends UserEntityValidateDTO implements IUser {
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
