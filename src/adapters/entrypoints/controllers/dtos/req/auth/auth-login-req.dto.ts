// Object encapsulating data required for a single operation
// May contain data transform and validation

import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IsNotEmpty, IsString, Length } from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IAuthRestServiceAuthLoginParams } from 'src/application/interfaces/services/auth/auth-rest/methods/auth-login.interface';

export class AuthLoginReqDTO implements IAuthRestServiceAuthLoginParams {
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  password: string;
}
