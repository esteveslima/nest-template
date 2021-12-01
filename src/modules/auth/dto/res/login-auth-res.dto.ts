// Object encapsulating data required for a single operation
// Also possible to make data transform and validation

import {} from '@nestjs/mapped-types';
import { Expose } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator

// Create DTO extending Entity, which contains all the typeORM validations and Pipe validations
// May modify or omit certain properties to match the operation

// DTO for login fields
export class LoginAuthResDTO {
  @Expose()
  token: string;
}
