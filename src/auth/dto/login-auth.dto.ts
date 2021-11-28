// Object encapsulating data required for a single operation
// Also possible to make data transform and validation

import {} from '@nestjs/mapped-types';
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IsNotEmpty, IsString, Length } from 'class-validator'; // validation tools https://github.com/typestack/class-validator

// Create DTO extending Entity, which contains all the typeORM validations and Pipe validations
// May modify or omit certain properties to match the operation

// DTO for login fields
export class LoginAuthDTO {
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  username: string;

  @IsString()
  @Length(5, 80)
  password: string;
}
