import { enumRole } from 'src/modules/apps/user/domain/entities/user';

export class AuthTokenPayload {
  id: string;
  name: string;
  email: string;
  role: keyof typeof enumRole;
  [key: string]: unknown;
}
