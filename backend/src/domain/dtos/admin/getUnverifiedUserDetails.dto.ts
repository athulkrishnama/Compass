import { VERIFICATION_STATUS } from "@domain/types/verficationStatus";

export interface IGetUnverifedUserDetailsResponseDTO {
  id: string;
  full_name: string;
  email: string;
  profile_image?: string;
  is_verified: VERIFICATION_STATUS;
  verification_id_image?: string;
}
