import type { ROLE } from "@/types/role";

interface client {
    id: string;
    full_name: string;
    email: string;
    is_blocked: boolean;
    role: ROLE;
}

export interface IGetUsersResponse {
    totalPages: number;
    clients: client[];
}
