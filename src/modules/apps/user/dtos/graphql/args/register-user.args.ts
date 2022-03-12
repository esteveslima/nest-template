import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';
import { UserEntityBaseArgsDTO } from './base/user-entity-base.args';

@ArgsType()
export class RegisterUserArgsDTO extends PickType(UserEntityBaseArgsDTO, [
  'username',
  // 'password',
  'email',
  'role',
  'gender',
  'age',
] as const) {
  @Field(() => String)
  @IsNotEmpty()
  @Length(5, 80)
  password: string;
}
