import type { ROLE } from "@/types/role";

export interface loginResponse {
    accessToken: string;
    userData: {
        email: string;
        full_name: string;
        id: string;
        role: ROLE;
    };
}
