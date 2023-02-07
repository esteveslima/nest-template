// Object encapsulating data required for a single operation
// requires the Expose decorator to keep the property across the response serialization

import { Expose } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IAuthRestServiceAuthLoginResult } from 'src/application/interfaces/services/auth/auth-rest/methods/auth-login.interface';

export class AuthLoginRestResponseDTO
  implements IAuthRestServiceAuthLoginResult
{
  token: string;
}
