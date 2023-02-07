import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';
import { IUserGraphqlServiceRegisterUserParams } from 'src/application/interfaces/services/user/user-graphql/methods/register-user.interface';
import { UserBaseGraphqlArgsDTO } from './base/user-base-graphql-args.dto';

@ArgsType()
export class RegisterUserGraphqlArgsDTO
  extends PickType(UserBaseGraphqlArgsDTO, [
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
