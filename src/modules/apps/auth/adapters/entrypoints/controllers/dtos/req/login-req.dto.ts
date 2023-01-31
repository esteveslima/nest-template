// Object encapsulating data required for a single operation
// May contain data transform and validation

import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IsNotEmpty, IsString, Length } from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { ILoginAuthRestParams } from 'src/modules/apps/auth/application/types/auth-rest-service/login.interface';

export class LoginReqDTO implements ILoginAuthRestParams {
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  password: string;
}
