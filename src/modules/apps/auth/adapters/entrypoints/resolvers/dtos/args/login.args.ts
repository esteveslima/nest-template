import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IAuthGraphqlServiceLoginParams } from 'src/modules/apps/auth/application/interfaces/services/auth-graphql/methods/login.interface';

@ArgsType()
export class LoginArgsDTO implements IAuthGraphqlServiceLoginParams {
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
