import { enumRole } from 'src/modules/apps/user/domain/user.interface';

export class AuthTokenPayload {
  id: string;
  name: string;
  email: string;
  role: keyof typeof enumRole;
}
