import {
  ICalculateFareRequestDTO,
  ICalculateFareResponseDTO,
} from "@domain/dtos/fare/calculateFare.dto";

export interface ICreateFareUseCase {
  execute(dto: ICalculateFareRequestDTO): Promise<ICalculateFareResponseDTO>;
}
