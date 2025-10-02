import { ROLES } from "@domain/types/roles";

export interface ICreateUserRequestDTO {
  email: string;
  password: string;
  role: ROLES;
  full_name: string;
}
