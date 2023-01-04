// Object encapsulating data required for a single operation
// requires the Expose decorator to keep the property across the response serialization

import { Expose } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { ILoginAuthRestResult } from 'src/modules/apps/auth/application/types/auth-rest-service/login.interface';
export class LoginResDTO implements ILoginAuthRestResult {
  token: string;
}
