// Object encapsulating data required for a single operation
// requires the Expose decorator to keep the property across the response serialization

import {} from '@nestjs/mapped-types';
import { Expose } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer

export class LoginAuthResDTO {
  @Expose()
  token: string;
}
