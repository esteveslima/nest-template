import { enumRole } from 'src/modules/user/interfaces/entity/user.interface';

export type roleType = keyof typeof enumRole;

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: roleType;
}
