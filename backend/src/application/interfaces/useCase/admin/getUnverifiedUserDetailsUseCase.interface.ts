import { IGetUnverifedUserDetailsResponseDTO } from "@domain/dtos/admin/getUnverifiedUserDetails.dto";

export interface IGetUnverifiedUserDetailsUseCase {
  get(id: string): Promise<IGetUnverifedUserDetailsResponseDTO>;
}
