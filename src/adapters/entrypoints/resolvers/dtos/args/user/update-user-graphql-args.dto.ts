import { ArgsType, Field, ID, PartialType, PickType } from '@nestjs/graphql';
import { IsOptional, IsUUID, Length } from 'class-validator';
import { IUserGraphqlServiceModifyUserParams } from 'src/application/interfaces/services/user/user-graphql/methods/modify-user.interface';
import { UserBaseGraphqlArgsDTO } from './base/user-base-graphql-args.dto';

type IUpdateUser = IUserGraphqlServiceModifyUserParams['indexes'] &
  IUserGraphqlServiceModifyUserParams['data'];

@ArgsType()
export class UpdateUserGraphqlArgsDTO
  extends PartialType(
    PickType(UserBaseGraphqlArgsDTO, [
      'username',
      // 'password',
      'email',
      'gender',
      'age',
    ] as const),
  )
  implements IUpdateUser
{
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(5, 80)
  password?: string;
}
