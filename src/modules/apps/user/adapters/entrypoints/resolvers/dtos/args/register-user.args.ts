import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';
import { IUserGraphqlServiceRegisterUserParams } from 'src/modules/apps/user/application/interfaces/services/user-graphql/methods/register-user.interface';
import { UserBaseArgsDTO } from './base/user-base.args';

@ArgsType()
export class RegisterUserArgsDTO
  extends PickType(UserBaseArgsDTO, [
    'username',
    // 'password',
    'email',
    'role',
    'gender',
    'age',
  ] as const)
  implements IUserGraphqlServiceRegisterUserParams
{
  @Field(() => String)
  @IsNotEmpty()
  @Length(5, 80)
  password: string;
}
