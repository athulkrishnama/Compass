import { ROLES } from "@domain/types/roles";
import { VERIFICATION_STATUS } from "@domain/types/verficationStatus";

export interface GetUnverfiedUsersRequestDTO {
  role: ROLES;
  pageNo: number;
  query?: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  profile_image?: string;
  is_verified: VERIFICATION_STATUS;
}

export interface GetUnverifiedUsersResponseDTO {
  totalPages: number;
  users: User[];
}
