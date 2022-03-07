import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';
import { UserEntityBaseArgs } from './base/user-entity-base.args';

@ArgsType() //TODO: rename to ...ArgsDTO
export class RegisterUserArgs extends PickType(UserEntityBaseArgs, [
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
