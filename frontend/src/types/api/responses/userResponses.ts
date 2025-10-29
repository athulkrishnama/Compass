import type { VERIFICATION_STATUS } from "@/types/verificationStatus";

export interface IGetUserProfileResponse {
    id: string;
    full_name: string;
    email: string;
    profile_image?: string;
    is_verified: VERIFICATION_STATUS;
    verfication_id_image?: string;
}
