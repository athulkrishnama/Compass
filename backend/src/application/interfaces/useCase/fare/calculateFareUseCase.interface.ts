import {
  ICalculateFareRequestDTO,
  ICalculateFareResponseDTO,
} from "@domain/dtos/fare/calculateFare.dto";

export { ICalculateFareRequestDTO, ICalculateFareResponseDTO };

export interface ICalculateFareUseCase {
  execute(data: ICalculateFareRequestDTO): Promise<ICalculateFareResponseDTO>;
}
