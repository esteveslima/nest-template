import { ArgsType, Field, ID, PartialType, PickType } from '@nestjs/graphql';
import { IsOptional, IsUUID, Length } from 'class-validator';
import { UserBaseArgsDTO } from './base/user-base.args';

@ArgsType()
export class UpdateUserArgsDTO extends PartialType(
  PickType(UserBaseArgsDTO, [
    'username',
    // 'password',
    'email',
    'gender',
    'age',
  ] as const),
) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(5, 80)
  password: string;
}
