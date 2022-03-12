import { enumRole } from 'src/modules/apps/user/interfaces/models/entities/user-entity.interface';

export type roleType = keyof typeof enumRole;

export interface IJwtTokenPayload {
  id: string;
  name: string;
  email: string;
  role: roleType;
}
