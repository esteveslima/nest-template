// Object encapsulating data required for a single operation
// requires the Expose decorator to keep the property across the response serialization

import { Expose } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IAuthRestServiceLoginResult } from 'src/modules/apps/auth/application/interfaces/services/auth-rest/methods/login.interface';
export class LoginResDTO implements IAuthRestServiceLoginResult {
  token: string;
}
