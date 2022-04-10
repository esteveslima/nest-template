import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@ArgsType()
export class LoginAuthArgsDTO {
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
