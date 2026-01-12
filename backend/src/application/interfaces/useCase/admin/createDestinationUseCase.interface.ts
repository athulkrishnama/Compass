import { ICreateDestinationRequestDTO } from "@domain/dtos/admin/createDestination.dto";

export interface ICreateDestinationUseCase {
  create(data: ICreateDestinationRequestDTO): Promise<void>;
}
