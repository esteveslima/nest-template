import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ILoginAuthGraphqlParams } from 'src/modules/apps/auth/application/types/auth-graphql-service/login.interface';

@ArgsType()
export class LoginArgsDTO implements ILoginAuthGraphqlParams {
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
