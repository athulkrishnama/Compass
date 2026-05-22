import { IDriverMatchingRequestDTO } from "@domain/dtos/ride/driverMatching.dto";

export interface IDriverMatchingUseCase {
  execute(dto: IDriverMatchingRequestDTO): Promise<void>;
}
