import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';
import { UserBaseArgsDTO } from './base/user-base.args';

@ArgsType()
export class RegisterUserArgsDTO extends PickType(UserBaseArgsDTO, [
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
