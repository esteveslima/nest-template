import { ArgsType, Field, ID, PartialType, PickType } from '@nestjs/graphql';
import { IsOptional, IsUUID, Length } from 'class-validator';
import { UserBaseArgsDTO } from './base/user-base.args';
@ArgsType()
export class UpdateCurrentUserArgsDTO extends PartialType(
  PickType(UserBaseArgsDTO, [
    'username',
    // 'password',
    'email',
    'gender',
    'age',
  ] as const),
) {
  // id: string; // use the id from the jwt token user

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(5, 80)
  password: string;
}
