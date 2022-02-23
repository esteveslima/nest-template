import { enumRoles } from './enum-roles.interface';

export type roleType = keyof typeof enumRoles;

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: roleType;
}
