import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IAuthGraphqlServiceAuthLoginParams } from 'src/application/interfaces/services/auth/auth-graphql/methods/auth-login.interface';

@ArgsType()
export class AuthLoginGraphqlArgsDTO
  implements IAuthGraphqlServiceAuthLoginParams
{
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  username: string;

  @Field(() => String)
  @IsNotEmpty()
  @Length(5, 80)
  password: string;
}
