import { ArgsType, Field, ID, PartialType, PickType } from '@nestjs/graphql';
import { IsOptional, IsUUID, Length } from 'class-validator';
import { UserEntityBaseArgsDTO } from '../base/user-entity-base.args';

@ArgsType()
export class UpdateUserArgsDTO extends PartialType(
  PickType(UserEntityBaseArgsDTO, [
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
