import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { IGetCabDetailsUseCase } from "@application/interfaces/useCase/cab/getCabDetailsUseCase.interface";
import { IGetCabDetailsResponseDTO } from "@domain/dtos/cab/getCabDetails.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { CabMapper } from "@mappers/cab.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetCabDetailsUseCase implements IGetCabDetailsUseCase {
  constructor(@inject("ICabRepo") private _cabRepo: ICabRepo) {}

  async execute(id: string): Promise<IGetCabDetailsResponseDTO> {
    const cab = await this._cabRepo.findByUserId(id);
    if (!cab || !cab._id) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.CAB_NOT_FOUND,
      );
    }
    return CabMapper.toGetCabDetailsResponseDTOfromEntity(cab);
  }
}
