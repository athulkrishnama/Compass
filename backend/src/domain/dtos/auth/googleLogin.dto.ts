import { ROLES } from "@domain/types/roles";

export interface IGoogleLoginRequestDTO {
  authorizationCode: string;
  role: ROLES;
}

export interface IGoogleLoginResponseDTO {
  email: string;
  full_name: string;
  id: string;
  role: ROLES;
}
