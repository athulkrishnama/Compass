import { ROLES } from "@domain/types/roles";

export interface IUserLoginRequestDTO {
  email: string;
  password: string;
}

export interface IUserLoginResponseDTO {
  email: string;
  full_name: string;
  id: string;
  role: ROLES;
}
