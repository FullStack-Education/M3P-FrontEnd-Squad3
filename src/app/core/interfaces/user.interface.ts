import { IRole } from './role.interface';

export interface IUser {
  id: string;
  name: string;
  papelId: string;
  password: string;
  image?: string;
  age?: string;
  phone?: string;
  email?: string;
  role?: IRole;
}
