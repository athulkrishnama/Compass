import {
  INearbyDriverResponseDTO,
  INearbyDriversRequestDTO,
} from "@domain/dtos/cab/nearbyDrivers.dto";

export interface IGetNearbyDriversUseCase {
  execute(dto: INearbyDriversRequestDTO): Promise<INearbyDriverResponseDTO[]>;
}
