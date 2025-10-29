import { ROLES } from "@domain/types/roles";

export interface IGetUsersRequestDTO {
  filter: {
    role: ROLES[] | undefined;
    query: string | undefined;
    status: boolean | undefined;
  };
  page: number;
}

interface client {
  id: string;
  full_name: string;
  email: string;
  is_blocked: boolean;
  role: ROLES;
}

export interface IGetUsersResponseDTO {
  totalPages: number;
  clients: client[];
}
