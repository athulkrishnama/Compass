import {
  IGetDestinationRequestDTO,
  IGetDestinationResponseDTO,
} from "@domain/dtos/destination/getDestination.dto";

export interface IGetDestinationUseCase {
  execute(
    request: IGetDestinationRequestDTO,
  ): Promise<IGetDestinationResponseDTO>;
}
