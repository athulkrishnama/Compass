import { IGetCabDetailsResponseDTO } from "@domain/dtos/cab/getCabDetails.dto";

export interface IGetCabDetailsUseCase {
  execute(id: string): Promise<IGetCabDetailsResponseDTO>;
}
