import type { VERIFICATION_STATUS } from "@/types/verificationStatus";

interface User {
    id: string;
    full_name: string;
    email: string;
    profile_image: string;
    is_verified: VERIFICATION_STATUS;
}

export interface IGetUnverifiedUsersResponseDTO {
    totalPages: number;
    users: User[];
}
