import { IListDestinationsUseCase } from "@application/interfaces/useCase/admin/ListDestinationsUseCase.interface";
import {
  IListDestinationRequestDTO,
  IListDestinationResponseDTO,
} from "@domain/dtos/admin/listDestinations.dto";
import { inject, injectable } from "tsyringe";
import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { DestinationMapper } from "@mappers/destination.mapper";

@injectable()
export class ListDestinationsUseCase implements IListDestinationsUseCase {
  constructor(
    @inject("IDestinationRepo") private _destinationRepo: IDestinationRepo,
  ) {}

  async execute(
    dto: IListDestinationRequestDTO,
  ): Promise<IListDestinationResponseDTO> {
    const { destinations, totalDestinations, pageNo, totalPages } =
      await this._destinationRepo.findByQuery(dto);

    return DestinationMapper.toListDestinationResponseDTOfromEntity(
      destinations,
      pageNo,
      totalPages,
      totalDestinations,
    );
  }
}
