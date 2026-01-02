import { VERIFICATION_STATUS } from "@domain/types/verficationStatus";

export interface IGetUserProfileResponseDTO {
  id: string;
  full_name: string;
  email: string;
  mobile?: string;
  date_of_birth?: Date;
  profile_image?: string;
  is_verified: VERIFICATION_STATUS;
  verfication_id_image?: string;
  rejection_reason?: string;
  is_google_login: boolean;
}
