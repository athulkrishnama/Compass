export interface IUpdateUserProfileRequest {
    full_name?: string;
    profile_image: File | null;
    verification_id_image: File | null;
}
