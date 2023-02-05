import { enumRole, User } from 'src/domain/entities/user';

export class AuthTokenPayload {
  id: User['id'];
  username: User['username'];
  email: User['email'];
  role: keyof typeof enumRole;
  [key: string]: unknown;
}
