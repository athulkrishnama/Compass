import { IUpdateDestinationRequestDTO } from "@domain/dtos/admin/updateDestination.dto";

export interface IUpdateDestinationUseCase {
  execute(requestDto: IUpdateDestinationRequestDTO): Promise<void>;
}
