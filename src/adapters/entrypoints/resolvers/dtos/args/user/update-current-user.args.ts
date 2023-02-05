import { ArgsType, Field, ID, PartialType, PickType } from '@nestjs/graphql';
import { IsOptional, IsUUID, Length } from 'class-validator';
import { IUserGraphqlServiceModifyUserParams } from 'src/application/interfaces/services/user/user-graphql/methods/modify-user.interface';
import { UserBaseArgsDTO } from './base/user-base.args';

type IUpdateUserData = IUserGraphqlServiceModifyUserParams['data'];

@ArgsType()
export class UpdateCurrentUserArgsDTO
  extends PartialType(
    PickType(UserBaseArgsDTO, [
      'username',
      // 'password',
      'email',
      'gender',
      'age',
    ] as const),
  )
  implements IUpdateUserData
{
  // id: string; // use the id from the jwt token user

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(5, 80)
  password?: string;
}
