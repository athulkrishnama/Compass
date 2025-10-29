export interface IUpdateUserProfileRequestDTO {
  id: string;
  full_name?: string;
  profile_image?: File;
  verification_id_image?: File;
}
