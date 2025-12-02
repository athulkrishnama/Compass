import { IGetCabDetailsResponseDTO } from "@domain/dtos/cab/getCabDetails.dto";
import { CabEntity } from "@domain/entities/cab/cab.entity";

export class CabMapper {
  static toGetCabDetailsResponseDTOfromEntity(
    entity: CabEntity,
  ): IGetCabDetailsResponseDTO {
    return {
      baseLocation: entity.baseLocation,
      isOnline: entity.isOnline,
      vehicleDetails: entity.vehicleDetails,
    };
  }
}
