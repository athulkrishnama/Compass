import {
  IListDestinationRequestDTO,
  IListDestinationResponseDTO,
} from "@domain/dtos/admin/listDestinations.dto";

export interface IListDestinationsUseCase {
  execute(
    dto: IListDestinationRequestDTO,
  ): Promise<IListDestinationResponseDTO>;
}
