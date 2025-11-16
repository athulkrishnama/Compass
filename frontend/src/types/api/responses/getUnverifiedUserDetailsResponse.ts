import type { VERIFICATION_STATUS } from "@/types/verificationStatus";

export interface IGetUnverifiedUserDetailsResponseDTO {
    id: string;
    full_name: string;
    email: string;
    profile_image?: string;
    is_verified: VERIFICATION_STATUS;
    verification_id_image?: string;
}
